document.addEventListener('DOMContentLoaded', () => {

  const playerNameDisplay = document.getElementById('player-name-display');
  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');
  const board = document.getElementById('game-board');
  const nextLevelBtn = document.getElementById('next-level');
  const levelTitle = document.getElementById('level-title');
  const levelHelp = document.getElementById('level-help');
  const playerName = localStorage.getItem('playerName') || 'Игрок';
  playerNameDisplay.textContent = playerName;

  let score = 0;
  let time = 60;
  let level = parseInt(localStorage.getItem('level') || '1');
  let timer;
  let targetShape = '';
  let targetColor = '';
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const shapes = ['circle','square','triangle','trapezoid','pentagon'];
  const shapeNames = {
    circle:'Круг',
    square:'Квадрат',
    triangle:'Треугольник',
    trapezoid:'Трапеция',
    pentagon:'Пятиугольник'
  };

  const colors = ['red','orange','yellow','green','cyan','blue','violet'];
  const colorNames = {
    red:'Красный',
    orange:'Оранжевый',
    yellow:'Жёлтый',
    green:'Зелёный',
    cyan:'Голубой',
    blue:'Синий',
    violet:'Фиолетовый'
  };

  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomPosition(maxW, maxH) {
    return {
      x: Math.random() * maxW,
      y: Math.random() * maxH
    };
  }

  function startTimer() {
    timerDisplay.textContent = time;
    timer = setInterval(() => {
      time--;
      timerDisplay.textContent = time;
      if (time <= 0) {
        clearInterval(timer);
        localStorage.setItem('score', score);
        alert('Время вышло! Ваш результат: ' + score);
        location.href = 'results.html';
      }
    }, 1000);
  }

  // -------------------------

  function generateBoard() {

    switch(level) {
      case 1:
        levelHelp.textContent = 'Дважды кликните по нужной фигуре';
        break;
      case 2:
        levelHelp.textContent = 'Перетащите нужную фигуру в выделенную зону';
        break;
      case 3:
        levelHelp.textContent = 'Наведите курсор на нужную фигуру и нажмите пробел';
        break;
    }
    if (level < 3) {
      nextLevelBtn.textContent = 'Переход на следующий уровень';
    } 
    else {
      nextLevelBtn.textContent = 'Окончить игру';
    }


    board.innerHTML = '';

    targetShape = getRandomItem(shapes);
    targetColor = getRandomItem(colors);

    levelTitle.textContent =
      `Уровень ${level} — Найдите: ${colorNames[targetColor]} ${shapeNames[targetShape]}`;

    const count = 8 + level * 2;
    const bw = board.clientWidth - 60;
    const bh = board.clientHeight - 60;
    const cells = [];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'game-cell';
      el.dataset.shape = getRandomItem(shapes);
      el.dataset.color = getRandomItem(colors);      
      const shapeEl = document.createElement('div');
      shapeEl.classList.add('shape', el.dataset.shape);
      shapeEl.style.color = el.dataset.color;
      el.appendChild(shapeEl);
      const pos = randomPosition(bw, bh);
      el.style.left = pos.x + 'px';
      el.style.top  = pos.y + 'px';
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      board.appendChild(el);
      cells.push(el);
    }

    // хотя бы 1 фигура - искомая
    const targetCell = getRandomItem(cells);
    targetCell.innerHTML = '';
    targetCell.dataset.shape = targetShape;
    targetCell.dataset.color = targetColor;
    const targetShapeDiv = document.createElement('div');
    targetShapeDiv.classList.add('shape', targetShape);
    targetShapeDiv.style.color = targetColor;
    targetCell.appendChild(targetShapeDiv);

    // логика уровней

    cells.forEach(cell => {
      // уровень 1
      if (level === 1) {
        let clicks = 0;
        cell.addEventListener('click', () => {
          clicks++;
          if (clicks === 2) {
            if (cell.dataset.shape === targetShape &&
                cell.dataset.color === targetColor) {
              score += 5;
              time += 2;
              cell.classList.add('correct');
              setTimeout(() => cell.classList.remove('correct'), 800);
              nextLevelBtn.style.display = 'block'; // показ кнопки
              generateBoard();
            } else {
              score -= 5;
              cell.classList.add('incorrect');
              setTimeout(() => cell.classList.remove('incorrect'), 800);
            }
            scoreDisplay.textContent = score;
          }
        });
      }

      // уровень 2
      if (level === 2) {
        cell.draggable = true;
        cell.addEventListener('dragstart', e => {
            e.dataTransfer.setData('cellIndex', 
              cells.indexOf(cell));
        });
      }

      // уровень 3 — падение
      if (level === 3) {
        const duration = 2500 + Math.random() * 2000;
        cell.animate([
          { top: '0px' },
          { top: bh + 'px' }
        ], {
          duration,
          iterations: Infinity,
          direction: 'alternate'
        });
      }
    });

    // зона проверки искомой фигуры во 2 уровне
    if (level === 2) {
      const zone = document.createElement('div');
      zone.className = 'drop-zone';
      zone.style.position = 'absolute';
      zone.style.left = (board.clientWidth / 2 - 50) + 'px';
      zone.style.bottom = '10px';
      zone.style.width = '100px';
      zone.style.height = '100px';
      zone.style.border = '2px dashed black';
      board.appendChild(zone);
      zone.addEventListener('dragover', e => e.preventDefault());      //
      zone.addEventListener('drop', e => {
        const index = e.dataTransfer.getData('cellIndex');
        const cell = cells[index];
        if (!cell) return;
        if (cell.dataset.shape === targetShape &&
          cell.dataset.color === targetColor) {
          score += 4;
          time += 2;
         cell.classList.add('correct');
          setTimeout(() => cell.classList.remove('correct'), 800);
          nextLevelBtn.style.display = 'block';
         generateBoard();
        } 
        else {
         score -= 6;
         cell.classList.add('incorrect');
         setTimeout(() => cell.classList.remove('incorrect'), 800);
        }
        scoreDisplay.textContent = score;
      });
    }
  }

  // нажатие пробела - уровень 3 ----
  document.addEventListener('keydown', e => {
    if (level !== 3) return;
    if (e.code !== 'Space') return;
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach(cell => {
      const rect = cell.getBoundingClientRect();
      if (
        rect.left < mouseX &&
        rect.right > mouseX &&
        rect.top < mouseY &&
        rect.bottom > mouseY
      ) {
        if (cell.dataset.shape === targetShape &&
            cell.dataset.color === targetColor) {
          score += 8;
          time += 3;
          cell.classList.add('correct');
          setTimeout(() => cell.classList.remove('correct'), 800);
          nextLevelBtn.style.display = 'block'; // показ кнопки
          generateBoard();
        } else {
          score -= 4;
          cell.classList.add('incorrect');
          setTimeout(() => cell.classList.remove('incorrect'), 800);
        }
        scoreDisplay.textContent = score;
      }
    });
  });

  // -------------------------

  // кнопка перехода уровней
  nextLevelBtn.addEventListener('click', () => {
    level++;
    nextLevelBtn.style.display = 'none'; // сокрытик при входе на уровень
    if (level > 3) {
      localStorage.setItem('score', score);
      location.href = 'results.html';
    }
    else {
      generateBoard();
    }
  });

  startTimer();
  generateBoard();

});
