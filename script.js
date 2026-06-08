let score = 0;
let time = 60;
let combo = 0;
let timer = null;

let totalCount = 0;
let correctCount = 0;
let maxRange = 10;
let currentLives = 5;
let correctIndex = 0;
let isAnswerProcessing = false;

function setDiff(range, btnId) {
  maxRange = range;
  document.querySelectorAll('.diff-option').forEach(btn => btn.classList.remove('active'));
  document.getElementById(btnId).classList.add('active');
}

function updateHearts() {
  let str = '';
  for(let i=0; i<5; i++) {
    str += (i < currentLives) ? '💚' : '🖤';
  }
  document.getElementById('lives').textContent = '🦑 크라켄 위협: ' + str;
}

function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('playScreen').classList.remove('hidden');
  
  score = 0;
  time = 60;
  combo = 0;
  totalCount = 0;
  correctCount = 0;
  currentLives = 5;
  isAnswerProcessing = false;

  updateHearts();
  nextQuestion();
  
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    time--;
    document.getElementById('time').textContent = time;
    if (time <= 0) endGame(false);
  }, 1000);
}

function makeExp() {
  let a = Math.floor(Math.random() * (maxRange + 1));
  let b = Math.floor(Math.random() * (maxRange + 1));
  let ops = ['+', '-', '*'];
  let op = ops[Math.floor(Math.random() * ops.length)];

  if (op === '-' && a < b) { let temp = a; a = b; b = temp; }

  let value = 0;
  if (op === '+') value = a + b;
  if (op === '-') value = a - b;
  if (op === '*') value = a * b;

  return { text: a + " " + op + " " + b, val: value };
}

function nextQuestion() {
  isAnswerProcessing = false;

  let correctExp = makeExp();
  let target = correctExp.val;
  document.getElementById('targetNum').textContent = target;

  let wrongVal = target + (Math.random() > 0.5 ? 4 : 6);
  let wrongText = wrongVal + " + 0";

  correctIndex = Math.random() > 0.5 ? 1 : 0;

  if (correctIndex === 0) {
    document.getElementById('textLeft').textContent = correctExp.text;
    document.getElementById('textRight').textContent = wrongText;
  } else {
    document.getElementById('textLeft').textContent = wrongText;
    document.getElementById('textRight').textContent = correctExp.text;
  }
}

function checkAnswer(chosenIndex) {
  if (isAnswerProcessing) return;
  isAnswerProcessing = true;

  totalCount++;
  let feedback = document.getElementById('feedback');
  let gameContainer = document.getElementById('gameContainer');

  if (chosenIndex === correctIndex) {
    correctCount++;
    score += 10 + combo * 2;
    combo++;
    feedback.textContent = '✅';
  } else {
    combo = 0;
    currentLives--;
    feedback.textContent = '❌';
    updateHearts();

    gameContainer.classList.add('shake-effect');
    setTimeout(() => {
      gameContainer.classList.remove('shake-effect');
    }, 300);

    if (currentLives <= 0) {
      endGame(true);
      return;
    }
  }

  document.getElementById('score').textContent = score;
  document.getElementById('combo').textContent = combo;

  setTimeout(() => {
    feedback.textContent = '';
    nextQuestion();
  }, 400);
}

function endGame(isKrakenAttacked) {
  clearInterval(timer);
  document.getElementById('playScreen').classList.add('hidden');
  document.getElementById('endScreen').classList.remove('hidden');

  let title = document.getElementById('endTitle');
  let krakenContainer = document.getElementById('krakenContainer');

  if (isKrakenAttacked) {
    title.textContent = '크라켄에게 잡아 먹혔습니다. 실패!!';
    title.style.color = '#ff3366';
    krakenContainer.innerHTML = '<img src="cri.png" alt="Kraken" class="kraken-img-animate">';
  } else {
    title.textContent = '🎉 항해 무사 통과 완료!';
    title.style.color = '#00ffcc';
    krakenContainer.innerHTML = '';
  }

  document.getElementById('finalScore').textContent = score;
  document.getElementById('finalAccuracy').textContent = correctCount + " / " + totalCount;
}
