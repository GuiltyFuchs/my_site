    const startBtn = document.getElementById('start-game');
    const nameInput = document.getElementById('player-name');

    startBtn.addEventListener('click', ()=>{
      const name = nameInput.value.trim();
      if(!name){ alert('Введите имя игрока!'); return; }
      localStorage.setItem('playerName', name);
      localStorage.setItem('level', '1'); // стандартный запуск с 1 уровня
      window.location.href = 'game.html';
    });

    document.querySelectorAll('.level-select').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const name = nameInput.value.trim();
        if(!name){ alert('Введите имя игрока!'); return; }
        localStorage.setItem('playerName', name);
        localStorage.setItem('level', btn.dataset.level);
        window.location.href = 'game.html';
      });
    });