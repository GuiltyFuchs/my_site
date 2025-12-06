document.addEventListener("DOMContentLoaded", () => {

    const box = document.getElementById("flexBox");
    const titleTop = document.getElementById("titleTop");
    const titleBottom = document.getElementById("titleBottom");
    const pot = document.getElementById("pot");
    const lid = document.getElementById("lid");

    let state = 1;

    function reset() {
        state = 1;

        titleTop.classList.add("hidden");
        titleBottom.classList.add("hidden");

        pot.classList.add("hidden");
        pot.classList.remove("pulse");

        lid.classList.add("hidden");
        lid.classList.remove("slap");
    }

    /* ---------- Наведение ---------- */
    box.addEventListener("mouseenter", () => {
        if (state !== 1) return;

        titleTop.classList.remove("hidden");

        pot.classList.remove("hidden");
        pot.classList.add("pulse");

        state = 2;
    });

    box.addEventListener("mouseleave", () => {
        if (state !== 2) return;

        titleTop.classList.add("hidden");

        pot.classList.add("hidden");
        pot.classList.remove("pulse");

        state = 1;
    });

    /* ---------- КЛИК ---------- */
    box.addEventListener("click", (e) => {
        if (state === 2) {
            // Включаем крышку
            pot.classList.remove("pulse");
            lid.classList.remove("hidden");
            state = 3;
        } else if (state === 4) {
            // Следующий клик — сброс
            reset();
        }
    });

    /* ---------- ЗАЖАТИЕ ---------- */
    box.addEventListener("mousedown", (e) => {
        if (state !== 3) return;

        // начинаем хлопки крышкой
        lid.classList.add("slap");
    });

    /* ---------- ОТПУСКАНИЕ ---------- */
    box.addEventListener("mouseup", () => {
        if (state !== 3) return;

        // останавливаем хлопки, добавляем надпись
        lid.classList.remove("slap");
        titleBottom.classList.remove("hidden");

        setTimeout(() => {
        if (state === 3) {
            state = 4;
        }
    }, 50);
    });

});
