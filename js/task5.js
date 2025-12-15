document.addEventListener("DOMContentLoaded", () => {
  const pano = document.getElementById("pano");
  const pieces = [...document.querySelectorAll(".piece")];

  let active = null, shiftX = 0, shiftY = 0;

  pieces.forEach(p => {
    // хаотичное начальное положение
    p.style.left = Math.random() * 400 + "px";
    p.style.top  = Math.random() * 250 + "px";

    const r = Math.floor(Math.random() * 4) * 90;
    p.dataset.rotCur = r;
    p.style.setProperty("--r", r + "deg");

    // drag
    p.addEventListener("mousedown", e => {
      active = p;
      shiftX = e.offsetX;
      shiftY = e.offsetY;
      p.style.cursor = "grabbing";
    });

    // поворот ПКМ
    p.addEventListener("contextmenu", e => {
      e.preventDefault();
      let r = (+p.dataset.rotCur + 90) % 360;
      p.dataset.rotCur = r;
      p.style.setProperty("--r", r + "deg");
      check();
    });
  });

  document.addEventListener("mousemove", e => {
    if (!active) return;
    const rect = pano.getBoundingClientRect();
    active.style.left = e.clientX - rect.left - shiftX + "px";
    active.style.top  = e.clientY - rect.top  - shiftY + "px";
  });

  document.addEventListener("mouseup", () => {
    if (active) {
      active.style.cursor = "grab";
      active = null;
      checkLine();
    }
  });

  function checkLine() {
  const tolerance = 60;
  let ok = true;

  // сортируем по X (слева направо)
  const sorted = [...pieces].sort((a, b) =>
    parseInt(a.style.left) - parseInt(b.style.left)
  );

  // проверка Y (одна линия)
  const baseY = parseInt(sorted[0].style.top);

  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const y = parseInt(p.style.top);

    // все на одной высоте
    if (Math.abs(y - baseY) > tolerance) {
      ok = false;
      break;
    }

    // проверка поворота
    if (+p.dataset.rotCur !== +p.dataset.rot) {
      ok = false;
      break;
    }

    // проверка "вплотную"
    if (i > 0) {
      const prev = sorted[i - 1];
      const prevRight =
        parseInt(prev.style.left) +
        prev.querySelector("img").offsetWidth;

      const curLeft = parseInt(p.style.left);

      if (Math.abs(curLeft - prevRight) > tolerance) {
        ok = false;
        break;
      }
    }
    }
    if (ok) {
      pano.classList.add("success");
      updateOutline(sorted);
    } 
    else {
      pano.classList.remove("success");
    }
  }

  /* общий контур */
  // function updateOutline(elements) {
  //   let minX = Infinity;
  //   let minY = Infinity;
  //   let maxX = -Infinity;
  //   let maxY = -Infinity;

  //   elements.forEach(p => {
  //     const x = parseInt(p.style.left);
  //     const y = parseInt(p.style.top);
  //     const img = p.querySelector("img");

  //     minX = Math.min(minX, x);
  //     minY = Math.min(minY, y);
  //     maxX = Math.max(maxX, x + img.offsetWidth);
  //     maxY = Math.max(maxY, y + img.offsetHeight);
  //   });

  //   outline.style.left = minX + "px";
  //   outline.style.top = minY + "px";
  //   outline.style.width = (maxX - minX) + "px";
  //   outline.style.height = (maxY - minY) + "px";
  // }
});
