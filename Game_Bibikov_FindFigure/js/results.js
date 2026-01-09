  const playerName = localStorage.getItem('playerName') || 'Игрок';
  const score = localStorage.getItem('lastScore') || 0;

  document.getElementById('player-name').textContent = playerName;
  document.getElementById('score').textContent = score;

  const ratingList = document.getElementById('rating-list');
  const results = JSON.parse(localStorage.getItem('gameResults')) || [];

  results.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `Игрок — ${item.name} набрал ${item.score} очков`;
    ratingList.appendChild(li);
  });

