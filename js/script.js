/* jshint esversion: 8 */

const qwerty = document.getElementById("qwerty");
const word = document.getElementById("word");
let missed = 0;

const overlay = document.getElementById("overlay");
const setupForm = document.getElementById("setup-form");
const scoreboard = document.getElementById("scoreboard");
const winScreen = document.querySelector(".win-screen");
const loseScreen = document.querySelector(".lose-screen");
const timer = document.getElementById("timer");

let difficulty;
let lifeIcon;
let currentWord;
let wordArray;
let currentStreak = 0;

const TOTAL_TIME = 25;
let timeRemaining;
let timerInterval;

async function getRandomWordAsArray(level) {
  try {
    const response = await fetch("./answers.json");
    const data = await response.json();
    const words = data.answers[level];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    currentWord = randomWord;
    const wordArray = randomWord.split("");
    return wordArray;
  } catch (error) {
    console.error("Error loading word list:", error);
  }
}

function checkLetter(letter) {
  const letterListItems = word.querySelectorAll(".letter");
  let matchedLetter = null;

  letterListItems.forEach((listItem) => {
    if (listItem.textContent === letter) {
      listItem.classList.add("show");
      matchedLetter = letter;
    }
  });

  return matchedLetter;
}

function removeLife() {
  missed++;

  const liveImage = scoreboard.querySelector('img[src*="live"]');
  liveImage.src = liveImage.src.replace("live", "lost");
}

function resetKeyboard() {
  const keyboardButtons = qwerty.querySelectorAll("button");
  keyboardButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("chosen");
  });
}

function resetScoreboard() {
  const lifeImages = scoreboard.querySelectorAll("img");
  lifeImages.forEach((img) => {
    img.src = `./images/live${lifeIcon}.png`;
  });
}

function startTimer() {
  clearInterval(timerInterval);

  timeRemaining = TOTAL_TIME;
  timer.querySelector("p").textContent = timeRemaining;

  timerInterval = setInterval(() => {
    timeRemaining--;
    timer.querySelector("p").textContent = timeRemaining;

    if (timeRemaining % 5 === 0) {
      removeLife();
      checkWin();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function checkWin() {
  const totalLetters = word.querySelectorAll(".letter").length;
  const revealedLetters = word.querySelectorAll(".show").length;

  if (revealedLetters === totalLetters) {
    currentStreak++;
    localStorage.setItem(`currentStreak_${difficulty}`, currentStreak);

    let bestStreak = Number(localStorage.getItem(`bestStreak_${difficulty}`)) || 0;
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
      localStorage.setItem(`bestStreak_${difficulty}`, bestStreak);
    }

    const winScreenParagraphs = winScreen.querySelectorAll("p");
    winScreenParagraphs[0].textContent = `Current Streak: ${currentStreak}`;
    winScreenParagraphs[1].textContent = `Best Streak: ${bestStreak}`;

    stopTimer();
    overlay.className = "win";
    overlay.style.display = "flex";
  } else if (missed >= 5) {
    currentStreak = 0;
    localStorage.setItem(`currentStreak_${difficulty}`, currentStreak);

    const bestStreak = Number(localStorage.getItem(`bestStreak_${difficulty}`)) || 0;
    loseScreen.querySelector("p").textContent = `Best Streak: ${bestStreak}`;

    stopTimer();
    overlay.className = "lose";
    overlay.style.display = "flex";
  }
}

function handleInteraction(button) {
  button.disabled = true;
  button.classList.add("chosen");

  const letter = button.textContent;
  const result = checkLetter(letter);

  if (result === null) {
    removeLife();
  }

  checkWin();
}

function addWordToDisplay(arr) {
  const wordList = word.querySelector("ul");

  arr.forEach((character) => {
    const listItem = document.createElement("li");
    listItem.textContent = character;
    listItem.classList.add("letter");
    wordList.appendChild(listItem);
  });
}

async function startNewGame() {
  resetKeyboard();
  resetScoreboard();
  missed = 0;
  word.querySelector("ul").innerHTML = "";

  wordArray = await getRandomWordAsArray(difficulty);
  addWordToDisplay(wordArray);

  if (difficulty === "hard") {
    startTimer();
  } else {
    timer.querySelector("p").textContent = "";
  }

  overlay.style.display = "none";
}

function goToStartScreen() {
  resetKeyboard();
  missed = 0;
  word.querySelector("ul").innerHTML = "";
  setupForm.reset();

  overlay.className = "start";
  overlay.style.display = "";
}

function saveThemeToLocalStorage(theme) {
  localStorage.setItem("theme", theme);
}

function loadThemeFromLocalStorage() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
    document.getElementById("theme").value = savedTheme;
  }
}

document.addEventListener("DOMContentLoaded", loadThemeFromLocalStorage);

setupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  difficulty = document.getElementById("difficulty").value;
  lifeIcon = document.getElementById("lifeicon").value;

  const theme = document.getElementById("theme").value;
  document.documentElement.dataset.theme = theme;
  saveThemeToLocalStorage(theme);

  resetScoreboard();

  wordArray = await getRandomWordAsArray(difficulty);
  addWordToDisplay(wordArray);

  if (difficulty === "hard") {
    startTimer();
  } else {
    timer.querySelector("p").textContent = "";
  }

  overlay.style.display = "none";
});

winScreen.querySelector(".btn_reset").addEventListener("click", startNewGame);
loseScreen.querySelector(".btn_reset").addEventListener("click", startNewGame);
winScreen.querySelector(".btn_home").addEventListener("click", goToStartScreen);
loseScreen.querySelector(".btn_home").addEventListener("click", goToStartScreen);

function isGameActive() {
  return overlay.style.display === "none";
}

qwerty.addEventListener("click", (event) => {
  if (!isGameActive()) {
    return;
  }

  if (event.target.tagName === "BUTTON") {
    handleInteraction(event.target);
  }
});

document.addEventListener("keydown", (event) => {
  if (!isGameActive()) {
    return;
  }

  const letter = event.key.toLowerCase();

  if (!/^[a-z]$/.test(letter)) {
    return;
  }

  const keyboardButtons = qwerty.querySelectorAll("button");
  keyboardButtons.forEach((button) => {
    if (button.textContent === letter && !button.disabled) {
      handleInteraction(button);
    }
  });
});
