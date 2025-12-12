document.addEventListener("DOMContentLoaded", () => {

  const latinArr = [
    "Consuetudo est altera natura",
    "Nota bene",
    "Nulla calamitas sola",
    "Per aspera ad astra"
  ];

  const ruArr = [
    "Привычка - вторая натура",
    "Заметьте хорошо!",
    "Беда не приходит одна",
    "Через тернии к звёздам"
  ];

  const randBox = document.getElementById("rand");
  const createBtn = document.getElementById("createBtn");
  const repaintBtn = document.getElementById("repaintBtn");
  const resetBtn = document.getElementById("resetBtn");

  // генерирация случайного порядка
  let order = [...latinArr.keys()];
  shuffle(order);
  let clickCount = 0;

  function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function resetAll(){
    randBox.innerHTML = "";   // очистка DOM
    clickCount = 0;
    order = [...latinArr.keys()];
    shuffle(order);
    }

    // создать 
  createBtn.addEventListener("click", () => {
    if(order.length === 0){
      alert("Фразы закончились");
      return;
    }

    clickCount++;

    const index = order.pop();
    const latin = latinArr[index];
    const ru = ruArr[index];
    const p = document.createElement("p");

    p.id = "phrase-" + clickCount;
    p.classList.add("phrase");
    if(clickCount % 2 === 0){
      p.classList.add("class1");
    } else {
      p.classList.add("class2");
    }
    p.innerHTML = `
      <span class="num">n=${clickCount-1}.</span>
      <span class="latin">${latin}</span>
      <span class="ru">${ru}</span>
    `;
    randBox.appendChild(p);
  });

  // перекрас
  repaintBtn.addEventListener("click", () => {
    const lines = randBox.querySelectorAll(".phrase");
    lines.forEach((p, i) => {
      if((i + 1) % 2 === 0){
        p.classList.toggle("bold");
      }
    });
  });

  // сброс
  resetBtn.addEventListener("click", resetAll);
});
