let currentMode = "";
let score = 0;
let level = 1;
let correctInLevel = 0;
let timer;
let timeLeft = 30;
let currentAnswer = 0;
let currentInput = "";

function goToSettings() {
  document.getElementById("introScreen").classList.remove("active");
  document.getElementById("settingsScreen").classList.add("active");
}

function backToIntro() {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("introScreen").classList.add("active");
  playMusic();
}

function goToMode(mode) {
  currentMode = mode;
  document.getElementById("introScreen").classList.remove("active");

  if (mode === "survival") {
    document.getElementById("currentModeLabel").textContent = "Survival Mode";
    document.getElementById("level").style.display = "block";
    score = 0;
    level = 1;
    correctInLevel = 0;
    document.getElementById("scoreDisplay").textContent = "Skor: 0";
    document.getElementById("level").textContent = "Level: 1";
    document.getElementById("gameScreen").classList.add("active");
    nextSurvivalQuestion();
  } else {
    const title = mode === "quick" ? "Quick Mode" : "Challenge Mode";
    document.getElementById("modeTitle").textContent = title;
    document.getElementById("setupScreen").classList.add("active");
    document.getElementById("timeInput").disabled = false;
    document.getElementById("difficulty").style.display = "block";
    
  }
  document.getElementById("footer").style.display = "none";
}

function startGame() {
  score = 0;
  level = 1;
  correctInLevel = 0;
  updateScore();

  document.getElementById("setupScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");
  document.getElementById("scoreDisplay").textContent = "Skor: 0";
  document.getElementById("level").style.display = "none";

  const modeText = currentMode === "quick" ? "Quick Mode" : "challenge Mode";
  document.getElementById("currentModeLabel").textContent = modeText;

  timeLeft = parseInt(document.getElementById("timeInput").value);
  updateTimerDisplay();
  function updateTimerDisplay() {
  const timerElement = document.getElementById("timerDisplay");
  timerElement.textContent = timeLeft + " detik";

  // Cek mode tantangan dan waktu kurang dari 10 detik
  if (currentMode === "challenge" && timeLeft <= 10 && timeLeft > 0) {
    document.getElementById("beepSound").play();
  }

  // Efek visual jika ingin (opsional)
  if (currentMode === "challenge" &&timeLeft <= 10) {
    timerElement.style.color = "red";
    timerElement.style.fontWeight = "bold";
    timerElement.style.fontSize = "24px";
  } else {
    timerElement.style.color = "white";
    timerElement.style.fontSize = "20px";
  }
}

  generateQuestion();
  stopMusic();
  document.getElementById("footer").style.display = "none";
  if (currentMode === "challenge") {
  clearInterval(timer); // jaga-jaga
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}
}


function updateScore() {
  document.getElementById("scoreDisplay").textContent = "Skor: " + score;
}

function updateTimerDisplay() {
  document.getElementById("timerDisplay").textContent = `Waktu: ${timeLeft}s`;
  document.getElementById("timerDisplay").classList.remove("warning");
}

function generateQuestion() {
  currentInput="";
  const difficulty = document.getElementById("difficulty").value;
  let operation = document.getElementById("operation").value;

  let a = generateNumber(difficulty);
  let b = generateNumber(difficulty);

  if (operation === "mix") {
    const ops = ["add", "sub", "mul", "div"];
    operation = ops[Math.floor(Math.random() * ops.length)];
  }

  if (operation === "add") {
    currentAnswer = a + b;
    setQuestion(`${a} + ${b}`);
  } else if (operation === "sub") {
    if (a < b) [a, b] = [b, a];
    currentAnswer = a - b;
    setQuestion(`${a} - ${b}`);
  } else if (operation === "mul") {
    currentAnswer = a * b;
    setQuestion(`${a} × ${b}`);
  } else if (operation === "div") {
    b = b === 0 ? 1 : b;
    a = a - (a % b);
    currentAnswer = a / b;
    setQuestion(`${a} ÷ ${b}`);
  }
  if (currentMode === "quick") {
  clearInterval(timer);
  timeLeft = parseInt(document.getElementById("timeInput").value);
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}
}

function generateNumber(difficulty) {
  if (difficulty === "easy") return Math.floor(Math.random() * 10);
  if (difficulty === "normal") return Math.floor(Math.random() * 50);
  return Math.floor(Math.random() * 100);
}

function setQuestion(text) {
  document.getElementById("questionText").textContent = text;
  document.getElementById("answerInput").value = "";
  document.getElementById("answerInput").focus();
}
function checkAnswer() {
  const inputVal = currentInput.trim();

  if (inputVal === "" || inputVal === "-") {
    return; // Tidak lakukan apa-apa jika belum angka
  }
  const answer = parseInt(inputVal);
  // Lanjutkan seperti biasa...
  if (answer === currentAnswer) {
    score += 10;
    updateScore();
    document.getElementById("correctSound").play();

    if (currentMode === "survival") {
      correctInLevel++;
      if (correctInLevel >= 5) {
        level++;
        correctInLevel = 0;
      }
      document.getElementById("level").textContent = "Level: " + level;
      nextSurvivalQuestion();
      
    } else {
      generateQuestion();
      
    }
} else {
    document.getElementById("wrongSound").play();

if (currentMode === "survival" || currentMode === "quick") {
  clearInterval(timer);
  showResult();
} else if (currentMode === "challenge") {
  score -= 5;
  if (score < 0) score = 0;
  updateScore();
  generateQuestion(); // lanjut soal tanpa reset timer
}
  }

  document.getElementById("answerInput").value = "";
  currentInput="";
}

function nextSurvivalQuestion() {
  currentInput="";
  const max = 10 + level * 5;
  const a = Math.floor(Math.random() * max);
  const b = Math.floor(Math.random() * max);
  const op = ["+", "-", "*"][Math.floor(Math.random() * 3)];

  switch (op) {
    case "+": currentAnswer = a + b; break;
    case "-": currentAnswer = a - b; break;
    case "*": currentAnswer = a * b; break;
  }

  const symbol = op === "*" ? "×" : op;
  setQuestion(`${a} ${symbol} ${b}`);
  timeLeft = 30;
  updateTimerDisplay();
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}

function handleAnswerKey(e) {
  if (e.key === "Enter") checkAnswer();
}

function showResult() {
  clearInterval(timer);
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  setHighScore(currentMode, score);        // simpan jika lebih tinggi
updateHighScoreDisplay(currentMode);     // tampilkan di layar hasil
  document.getElementById("resultScreen").classList.add("active");
  document.getElementById("finalScore").textContent = score;
  playMusic();
}
function getHighScore(mode) {
  return localStorage.getItem(`highScore_${mode}`) || 0;
}

function setHighScore(mode, score) {
  const currentHigh = getHighScore(mode);
  if (score > currentHigh) {
    localStorage.setItem(`highScore_${mode}`, score);
  }
}

function updateHighScoreDisplay(mode) {
  const highScore = getHighScore(mode);
  document.getElementById("highScoreDisplay").textContent = highScore;
}
function playMusic() {
  const music = document.getElementById("bgMusic");
  if (music.paused) music.play();

  function handleFirstInteraction() {
    playMusic();
    window.removeEventListener("click", handleFirstInteraction);
    window.removeEventListener("touchstart", handleFirstInteraction);
  }

  window.addEventListener("click", handleFirstInteraction);
  window.addEventListener("touchstart", handleFirstInteraction);
}

function stopMusic() {
  const music = document.getElementById("bgMusic");
  if (!music.paused) music.pause();
}

function goToAbout() {
  document.getElementById("introScreen").classList.remove("active");
  document.getElementById("aboutScreen").classList.add("active");
  document.getElementById("footer").style.display = "none";
}
//*tombol keyboard
function appendNumber(num) {
  currentInput += num;
  document.getElementById("answerInput").value = currentInput;
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  document.getElementById("answerInput").value = currentInput;
}
function toggleNegative() {
  if (currentInput.startsWith("-")) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = currentInput === "" ? "-" : "-" + currentInput;
  }
  document.getElementById("answerInput").value = currentInput;
}
window.addEventListener("load", () => {
  const bgMusic = document.getElementById("bgMusic");
  const musicVolume = document.getElementById("musicVolume");
  const savedVolume = localStorage.getItem("volumeMusic") || "0.5";

  bgMusic.volume = savedVolume;
  bgMusic.muted = false;
  musicVolume.value = savedVolume;
  document.getElementById("musicVolumeValue").textContent = `${Math.round(savedVolume * 100)}%`;

  musicVolume.addEventListener("input", () => {
    bgMusic.volume = musicVolume.value;
    document.getElementById("musicVolumeValue").textContent = `${Math.round(musicVolume.value * 100)}%`;
    localStorage.setItem("volumeMusic", musicVolume.value);
  });

  const effectVolume = document.getElementById("effectVolume");
  const savedEffectVolume = localStorage.getItem("volumeEffect") || "0.5";

  document.getElementById("correctSound").volume = savedEffectVolume;
  document.getElementById("wrongSound").volume = savedEffectVolume;
  document.getElementById("beepSound").volume = savedEffectVolume;

  effectVolume.value = savedEffectVolume;
  document.getElementById("effectVolumeValue").textContent = `${Math.round(savedEffectVolume * 100)}%`;
const musicSlider = document.getElementById("musicVolume");
const effectSlider = document.getElementById("effectVolume");

function updateSliderBar(slider) {
  const val = slider.value * 100;
  slider.style.background = `linear-gradient(to right, #4caf50 ${val}%, #ccc ${val}%)`;
}

// Panggil saat nilai berubah
musicSlider.addEventListener("input", function () {
  updateSliderBar(musicSlider);
});

effectSlider.addEventListener("input", function () {
  updateSliderBar(effectSlider);
});

// Panggil juga saat halaman dimuat supaya langsung terlihat
updateSliderBar(musicSlider);
updateSliderBar(effectSlider);
  effectVolume.addEventListener("input", () => {
    const volume = effectVolume.value;
    document.getElementById("correctSound").volume = volume;
    document.getElementById("wrongSound").volume = volume;
    document.getElementById("beepSound").volume = volume;
    document.getElementById("effectVolumeValue").textContent = `${Math.round(volume * 100)}%`;
    localStorage.setItem("volumeEffect", volume);
  });
  playMusic();
});