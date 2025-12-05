document.addEventListener("DOMContentLoaded", () => {

    const box   = document.getElementById("flexBox");
    const boy   = document.getElementById("boy");
    const brick= document.getElementById("brick");
    const text  = document.getElementById("text");

    const IMGS = {
        boy1: "Images/boy1.png",
        boy2: "Images/boy2.png",
        boy3: "Images/boy3.png",
        brick:"Images/brick.png",
        text1:"Images/text1.png",
        text2:"Images/text2.png"
    };

    let frame = 1;

    // Hover -> Frame 2
    box.addEventListener("mouseenter", () => {

        if(frame !== 1) return;
        frame = 2;

        boy.classList.add("left");
        boy.src = IMGS.boy2;

        brick.classList.remove("hidden");

        text.src = IMGS.text1;
        text.classList.remove("hidden");
    });


    // Click
    box.addEventListener("click", () => {

        // Frame 3
        if(frame === 2){

            frame = 3;
            boy.classList.add("size");
            boy.src = IMGS.boy3;

            text.classList.add("hidden");

            // запуск анимации полета кирпича
            brick.classList.remove("fly");
            brick.offsetWidth;
            brick.classList.add("fly");
        }

        // Frame 4
        else if(frame === 3){

            frame = 4;

            text.src = IMGS.text2;
            text.classList.remove("hidden");

            box.classList.add("shake");
        }

        // Reset
        else if(frame === 4){

            frame = 1;

            // остановка тряски
            box.classList.remove("shake");

            // вернуть boy1
            boy.classList.remove("left");
            boy.classList.remove("size");

            boy.src = IMGS.boy1;

            // скрыть кирпич
            brick.classList.add("hidden");
            brick.classList.remove("fly");

            // сброс полета
            brick.offsetWidth;

            // скрыть текст
            text.classList.add("hidden");

        }

    });

});
