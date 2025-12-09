// ==== Глобальные переменные ====
let playerName = '';
let score = 0;
let level = 1;
let timer = 60;
let timerInterval = null;
let currentLevelTasks = 0;
let totalLevelTasks = 0;

// ==== DOM элементы ====
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    rating: document.getElementById('rating-screen')
};

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('exit-level').addEventListener('click', () => goToRating());
document.getElementById('restart-game').addEventListener('click', () => location.reload());

// ==== Запуск игры ====
function startGame() {
    playerName = document.getElementById('player-name').value.trim() || 'Игрок';
    if (!playerName) return alert('Введите имя!');
    
    document.getElementById('player-display').textContent = playerName;
    showScreen('game');
    startLevel(1);
}

// Переход сразу на уровень (для проверки!)
window.goToLevel = function(lvl) {
    playerName = 'Тестер';
    document.getElementById('player-display').textContent = playerName;
    showScreen('game');
    startLevel(lvl);
};
window.goToRating = () => showScreen('rating');

// ==== Переключение экранов ====
function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
    
    if (screenName === 'rating') showRating();
}

// ==== Запуск уровня ====
function startLevel(lvl) {
    level = lvl;
    score = 0;
    timer = 60 - (lvl-1)*15; // Уровень 1: 60с, 2: 45с, 3: 30с
    currentLevelTasks = 0;
    totalLevelTasks = lvl === 1 ? 4 : lvl === 2 ? 5 : 5;
    
    updateDisplays();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = timer;
        if (timer <= 0) endGame();
    }, 1000);

    document.getElementById('game-area').innerHTML = '';
    document.getElementById('task').textContent = '';

    if (lvl === 1) level1();
    if (lvl === 2) level2();
    if (lvl === 3) level3();
}

function updateDisplays() {
    document.getElementById('level-display').textContent = level;
    document.getElementById('score-display').textContent = score;
}

// ==== УРОВЕНЬ 1: Двойной клик по правильной фигуре ====
function level1() {
    const shapes = ['circle', 'square', 'triangle', 'star', 'hexagon'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    const correctShape = shapes[Math.floor(Math.random()*shapes.length)];
    const correctColor = colors[Math.floor(Math.random()*colors.length)];
    
    document.getElementById('task').textContent = 
        `Дважды кликните на ${getShapeName(correctShape)} ${getColorName(correctColor)} цвет!`;

    for (let i = 0; i < 12; i++) {
        const shape = shapes[Math.floor(Math.random()*shapes.length)];
        const color = colors[Math.floor(Math.random()*colors.length)];
        const div = document.createElement('div');
        div.className = `shape ${shape}`;
        div.style.background = color;
        div.style.left = Math.random()*80 + '%';
        div.style.top = Math.random()*70 + '%';
        div.style.width = div.style.height = (50 + Math.random()*70) + 'px';
        div.style.borderRadius = shape === 'circle' ? '50%' : '0';
        
        if (shape === 'triangle') {
            div.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            div.style.background = color;
        }
        if (shape === 'star') {
            div.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        }

        div.ondblclick = function() {
            if (shape === correctShape && color === correctColor) {
                div.classList.add('bounce');
                score += 100 * level;
                updateDisplays();
                this.remove();
                nextTask();
            } else {
                score -= 30;
                updateDisplays();
                div.classList.add('shake');
                setTimeout(() => div.classList.remove('shake'), 500);
            }
        };

        document.getElementById('game-area').appendChild(div);
    }
}

// ==== УРОВЕНЬ 2: Перетаскивание фигур в корзину (drag & drop) ====
function level2() {
    const correctSize = Math.random() > 0.5 ? 'big' : 'small';
    document.getElementById('task').innerHTML = 
        `Перетащите все <strong>${correctSize === 'big' ? 'БОЛЬШИЕ' : 'МАЛЕНЬКИЕ'}</strong> фигуры в корзину!`;

    const basket = document.createElement('div');
    basket.id = 'basket';
    basket.textContent = 'КОРЗИНА';
    basket.style.cssText = `
        position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
        width: 200px; height: 150px; background: rgba(255,255,255,0.3);
        border: 5px dashed white; border-radius: 20px; font-size: 2rem; line-height: 150px;
    `;
    document.getElementById('game-area').appendChild(basket);

    let correctDropped = 0;
    let totalCorrect = 0;

    for (let i = 0; i < 10; i++) {
        const isBig = Math.random() > 0.5;
        if ((correctSize === 'big' && isBig) || (correctSize === 'small' && !isBig)) totalCorrect++;
        
        const div = document.createElement('div');
        div.className = 'shape circle';
        div.draggable = true;
        div.style.background = '#'+Math.floor(Math.random()*16777215).toString(16);
        div.style.width = div.style.height = isBig ? '120px' : '60px';
        div.style.left = Math.random()*70 + '%';
        div.style.top = Math.random()*50 + '%';

        div.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text', 'dragging');
            div.style.opacity = '0.5';
        });
        div.addEventListener('dragend', () => div.style.opacity = '1');

        basket.addEventListener('dragover', e => e.preventDefault());
        basket.addEventListener('drop', e => {
            e.preventDefault();
            if (div.parentNode) {
                if ((correctSize === 'big' && isBig) || (correctSize === 'small' && !isBig)) {
                    correctDropped++;
                    score += 150 * level;
                } else {
                    score -= 50;
                }
                updateDisplays();
                div.remove();
                if (correctDropped === totalCorrect) nextTask();
            }
        });

        document.getElementById('game-area').appendChild(div);
    }
}

// ==== УРОВЕНЬ 3: Клавиши + наведение (hover) + падение фигур ====
function level3() {
    document.getElementById('task').textContent = 
        'Наведите на КРАСНЫЕ фигуры и нажмите ПРОБЕЛ, чтобы поймать!';

    let caught = 0;
    const needToCatch = 6;

    document.addEventListener('keydown', handleSpace);

    function handleSpace(e) {
        if (e.code === 'Space' && document.querySelector('.hovered')) {
            const hovered = document.querySelector('.hovered');
            if (hovered.style.background.includes('255, 0, 0') || hovered.style.background === 'red') {
                caught++;
                score += 200;
                updateDisplays();
                hovered.remove();
                if (caught >= needToCatch) nextTask();
            } else {
                score -= 100;
                updateDisplays();
            }
        }
    }

    setInterval(() => {
        if (currentLevelTasks < totalLevelTasks) {
            createFallingShape();
        }
    }, 1500);

    function createFallingShape() {
        const div = document.createElement('div');
        div.className = 'shape square';
        const isRed = Math.random() < 0.4;
        div.style.background = isRed ? 'red' : '#'+Math.floor(Math.random()*16777215).toString(16);
        div.style.left = Math.random()*80 + '%';
        div.style.top = '-100px';
        div.style.width = div.style.height = '80px';

        div.addEventListener('mouseenter', () => div.classList.add('hovered'));
        div.addEventListener('mouseleave', () => div.classList.remove('hovered'));

        document.getElementById('game-area').appendChild(div);

        let pos = -100;
        const fall = setInterval(() => {
            pos += 10;
            div.style.top = pos + 'px';
            if (pos > window.innerHeight) {
                clearInterval(fall);
                div.remove();
            }
        }, 50);
    }
}

// ==== Вспомогательные функции ====
function getShapeName(shape) {
    const names = {circle: 'круг', square: 'квадрат', triangle: 'треугольник', star: 'звезду', hexagon: 'шестиугольник'};
    return names[shape];
}
function getColorName(color) {
    const map = {
        '#ff6b6b': 'красный', '#4ecdc4': 'бирюзовый', '#45b7d1': 'синий',
        '#f9ca24': 'жёлтый', '#6c5ce7': 'фиолетовый'
    };
    return map[color] || '';
}

function nextTask() {
    currentLevelTasks++;
    if (currentLevelTasks >= totalLevelTasks) {
        clearInterval(timerInterval);
        if (level < 3) {
            setTimeout(() => startLevel(level + 1), 1000);
        } else {
            endGame();
        }
    } else {
        // Перезапускаем текущий уровень с новыми заданиями
        document.getElementById('game-area').innerHTML = '';
        document.getElementById('task').textContent = 'Новый раунд...';
        setTimeout(() => {
            if (level === 1) level1();
            if (level === 2) level2();
            if (level === 3) level3();
        }, 1500);
    }
}

function endGame() {
    clearInterval(timerInterval);
    saveResult();
    showScreen('rating');
}

// ==== Сохранение и рейтинг ====
function saveResult() {
    const results = JSON.parse(localStorage.getItem('findFigureRating') || '[]');
    results.push({name: playerName, score: score, date: new Date().toLocaleDateString()});
    results.sort((a,b) => b.score - a.score);
    results.splice(10); // топ-10
    localStorage.setItem('findFigureRating', JSON.stringify(results));
}

function showRating() {
    const results = JSON.parse(localStorage.getItem('findFigureRating') || '[]');
    const ol = document.getElementById('leaders');
    ol.innerHTML = '';
    results.forEach(r => {
        const li = document.createElement('li');
        li.textContent = `${r.name} — ${r.score} очков (${r.date})`;
        ol.appendChild(li);
    });
}