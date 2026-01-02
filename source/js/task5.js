document.addEventListener("DOMContentLoaded", () => {
  const pano = document.getElementById("pano");
  const pieces = [...document.querySelectorAll(".piece")];

  const SNAP = 10; // погрешность
  const original = document.getElementById("original");

  let originalActive = false;
  let originalShiftX = 0;
  let originalShiftY = 0;
  let active = null;
  let shiftX = 0;
  let shiftY = 0;

  function randomizePosition(piece) {
    const panoRect = pano.getBoundingClientRect();
    const pieceRect = piece.getBoundingClientRect();
    const maxX = panoRect.width - pieceRect.width;
    const maxY = panoRect.height - pieceRect.height;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    // const x = panoRect.width / 2;
    // const y = panoRect.height / 2;
    piece.style.left = x + "px";
    piece.style.top  = y + "px";
  }

  /* верная сборка */
  const correctLayout = {
    p1:  { x: 0,   y: 0   },
    p2:  { x: 100, y: 0   },
    p3:  { x: 200, y: 0   },
    p4:  { x: 0,   y: 100 },
    p5:  { x: 100, y: 100 },
    p6:  { x: 200, y: 100 },
    p7:  { x: 0,   y: 200 },
    p8:  { x: 100, y: 200 },
    p9:  { x: 200, y: 200 },
    p10: { x: 0,   y: 300 },
    p11: { x: 100, y: 300 },
    p12: { x: 200, y: 300 },
    p13: { x: 0,   y: 400 },
    p14: { x: 100, y: 400 },
    p15: { x: 200, y: 400 }
  };
 
  pieces.forEach((p, i) => {
    p.dataset.id = "p" + (i + 1);
    p.dataset.rot = 0;
    const r = Math.floor(Math.random() * 4) * 90;
    p.dataset.rotCur = r;
    p.style.setProperty("--r", r + "deg");
    randomizePosition(p);    

    p.addEventListener("mousedown", e => {
      active = p;
      const rect = p.getBoundingClientRect();
      shiftX = e.clientX - rect.left;
      shiftY = e.clientY - rect.top;

      p.style.cursor = "grabbing";
      p.style.zIndex = 10;

    });

    p.addEventListener("contextmenu", e => {
      e.preventDefault();
      let r = (+p.dataset.rotCur + 90) % 360;
      p.dataset.rotCur = r;
      p.style.setProperty("--r", r + "deg");
      checkComplete();
    });
    
  });

  document.addEventListener("mousemove", e => {
    if (!active) return;

    const rect = pano.getBoundingClientRect();
    active.style.left = e.clientX - rect.left - shiftX + "px";
    active.style.top  = e.clientY - rect.top  - shiftY + "px";
    document.onmousemove = ev => {
      const rect = pano.getBoundingClientRect();
      const maxX = pano.clientWidth - active.offsetWidth;
      const maxY = pano.clientHeight - active.offsetHeight;
      const newX = ev.clientX - rect.left - shiftX;        
      const newY = ev.clientY - rect.top  - shiftY;

      active.style.left =
        Math.max(0, Math.min(maxX, newX)) + "px";
      active.style.top =
        Math.max(0, Math.min(maxY, newY)) + "px";
    };
  });

  document.addEventListener("mouseup", () => {
    if (!active) return;

    active.style.cursor = "grab";
    active.style.zIndex = 1;

    trySnap(active);
    active = null;

    checkComplete();
  });

  /* прилипание */
  function trySnap(piece) {
    if (+piece.dataset.rotCur !== +piece.dataset.rot) return;

    const base = pieces[0]; // p1 — якорь
    const baseX = parseInt(base.style.left);
    const baseY = parseInt(base.style.top);
    const id = piece.dataset.id;
    const targetX = baseX + correctLayout[id].x;
    const targetY = baseY + correctLayout[id].y;
    const curX = parseInt(piece.style.left);
    const curY = parseInt(piece.style.top);

    if (
      Math.abs(curX - targetX) <= SNAP &&
      Math.abs(curY - targetY) <= SNAP
    ) {
      piece.style.left = targetX + "px";
      piece.style.top  = targetY + "px";
    }
  }

  /* проверка */
  function checkComplete() {
    let ok = true;

    const base = pieces[0];
    const baseX = parseInt(base.style.left);
    const baseY = parseInt(base.style.top);

    pieces.forEach(p => {
      const id = p.dataset.id;

      // поворот
      if (+p.dataset.rotCur !== +p.dataset.rot) {
        ok = false;
        return;
      }

      const expectedX = baseX + correctLayout[id].x;
      const expectedY = baseY + correctLayout[id].y;
      const curX = parseInt(p.style.left);
      const curY = parseInt(p.style.top);

      if (
        Math.abs(curX - expectedX) > 1 ||
        Math.abs(curY - expectedY) > 1
      ) {
        ok = false;
      }
    });

    pano.classList.toggle("success", ok);

    if (ok) {
      showOriginal();
    }
  }

  function showOriginal() {
    if (originalActive) return;
    originalActive = true;

    const base = pieces.find(p => p.dataset.id === "p1");
    const baseX = parseInt(base.style.left);
    const baseY = parseInt(base.style.top);

    original.style.left = baseX + "px";
    original.style.top  = baseY + "px";
    original.classList.add("active");

    // сокрытие частей
    pieces.forEach(p => {
      p.style.visibility = "hidden";
    });

    enableOriginalDrag();
  }


  function enableOriginalDrag() {
    original.addEventListener("mousedown", e => {
      const rect = original.getBoundingClientRect();
      originalShiftX = e.clientX - rect.left;
      originalShiftY = e.clientY - rect.top;

      original.style.cursor = "grabbing";

      document.onmousemove = ev => {
        const rect = pano.getBoundingClientRect();
        const maxX = pano.clientWidth - original.offsetWidth;
        const maxY = pano.clientHeight - original.offsetHeight;
        const newX = ev.clientX - rect.left - originalShiftX;
        const newY = ev.clientY - rect.top  - originalShiftY;

        original.style.left =
          Math.max(0, Math.min(maxX, newX)) + "px";
        original.style.top =
          Math.max(0, Math.min(maxY, newY)) + "px";
      };

      document.onmouseup = () => {
        original.style.cursor = "grab";
        document.onmousemove = null;
        document.onmouseup = null;
      };
    });
  }  
});
