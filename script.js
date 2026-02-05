// Memory Game JavaScript
const gameboard = document.getElementById('gameboard');
const resetBtn = document.getElementById('resetBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const turnsLeftSpan = document.getElementById('turns-left');
const winPopup = document.getElementById('win-popup');
const lossPopup = document.getElementById('loss-popup');
const winResetBtn = document.getElementById('win-reset-btn');
const lossTryAgainBtn = document.getElementById('loss-try-again-btn');
const scoreCounterSpan = document.getElementById('score-counter');
const startPage = document.getElementById('start-page');
const gamePage = document.getElementById('game-page');
const startGameBtn = document.getElementById('start-game-btn');

// Example images (add more if you want)
const images = [
  './images/image1.webp',
  './images/image2.webp',
  './images/image3.webp',
  './images/image4.webp',
  './images/image5.webp',
  './images/image6.webp',
  './images/image7.webp',
  './images/image8.webp',
  './images/image9.webp',
  './images/image10.webp',
  './images/image11.webp',
  './images/image12.webp'
];

const numPairs = 12; // 24 cards (12 pairs)
let cardValues = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let turns = 10; // Initialize turns
let matchedPairs = 0; // Track matched pairs
let score = 0; // Initialize score

function updateTurnsDisplay() {
  if (turnsLeftSpan) {
    turnsLeftSpan.textContent = turns;
  }
}

function updateScoreDisplay() {
  if (scoreCounterSpan) {
    scoreCounterSpan.textContent = `Score: ${score}`;
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setupBoard() {
  console.log('setupBoard called'); // Add this line
  gameboard.innerHTML = '';
  cardValues = [];
  turns = 10; // Reset turns
  matchedPairs = 0; // Reset matched pairs
  score = 0; // Reset score
  updateTurnsDisplay(); // Update display
  updateScoreDisplay(); // Update score display
  winPopup.style.display = 'none'; // Hide pop-ups
  lossPopup.style.display = 'none'; // Hide pop-ups
  // Pick random images and duplicate for pairs
  let chosen = [];
  while (chosen.length < numPairs) {
    const img = images[chosen.length % images.length];
    chosen.push(img);
  }
  cardValues = shuffle([...chosen, ...chosen]);

  cardValues.forEach((imgSrc, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = idx;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    const img = document.createElement('img');
    img.src = imgSrc;
    cardFront.appendChild(img);

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const cardBackImg = document.createElement('img');
    cardBackImg.src = './images/card-back.png'; // Path to your card back image
    cardBack.appendChild(cardBackImg);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', () => flipCard(card, imgSrc));
    gameboard.appendChild(card);
  });
}

function flipCard(card, imgSrc) {
  if (lockBoard || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  if (!firstCard) {
    firstCard = { card, imgSrc };
  } else if (!secondCard) {
    secondCard = { card, imgSrc };
    lockBoard = true;
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  if (firstCard.imgSrc === secondCard.imgSrc) {
    matchedPairs++;
    turns++; // Gain a turn on correct match
    score += 10; // Add 10 points for correct match
  } else {
    firstCard.card.classList.remove('flipped');
    secondCard.card.classList.remove('flipped');
    turns--; // Lose a turn on incorrect match
  }
  updateTurnsDisplay();
  updateScoreDisplay(); // Update score display

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  // Check for win/loss conditions
  if (matchedPairs === numPairs) {
    winPopup.style.display = 'flex'; // Show win pop-up
  } else if (turns <= 0) {
    lossPopup.style.display = 'flex'; // Show loss pop-up
  }
}

resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  setupBoard();
});

// Start Game button event
if (startGameBtn) {
  startGameBtn.addEventListener('click', () => {
    startPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    setupBoard();
  });
}

// Dark mode toggle
if (darkModeToggle) {
  darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });

  // Check for saved dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }
}

// Initial setup - only show start page
if (startPage && gamePage) {
  startPage.classList.remove('hidden');
  gamePage.classList.add('hidden');
} else if (gameboard) {
  // Fallback if start/game pages not found, directly setup game
  setupBoard();
  updateTurnsDisplay();
  updateScoreDisplay();
} else {
  console.error('Gameboard element not found!');
}

// Win/Loss pop-up button events
winResetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  setupBoard();
});

lossTryAgainBtn.addEventListener('click', (e) => {
  e.preventDefault();
  setupBoard();
});
