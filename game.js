const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let players = [];

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    score++;
    disableCards();
    updateScoreboard();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });
}

function updateScoreboard() {
  const scoreboard = document.getElementById('scoreboard');
  const playerNames = players.map(player => player.name);
  const currentPlayerIndex = playerNames.indexOf(document.getElementById('player-name').value);

  if (currentPlayerIndex === -1) {
    players.push({ name: document.getElementById('player-name').value, score: score });
  } else {
    players[currentPlayerIndex].score = score;
  }

  players.sort((a, b) => b.score - a.score);

  let html = '<ul>';
  players.forEach((player, index) => {
    html += `<li>${player.name}: ${player.score} wins</li>`;
  });
  html += '</ul>';

  scoreboard.innerHTML = html;
}

function resetEventListeners() {
  cards.forEach(card => card.removeEventListener('click', flipCard));
  cards.forEach(card => card.addEventListener('click', flipCard));
}

function flipAllCardsBack() {
  cards.forEach(card => {
    if (card.classList.contains('flip')) {
      card.classList.remove('flip');
    }
  });
}

document.getElementById('start-game').addEventListener('click', () => {
  flipAllCardsBack();
  shuffle();
  resetEventListeners();
  lockBoard = false;
});

document.getElementById('add-player').addEventListener('click', () => {
  const playerName = document.getElementById('player-name').value;
  if (playerName === '') return;

  players.push({ name: playerName, score: 0 });
  updateScoreboard();
});
