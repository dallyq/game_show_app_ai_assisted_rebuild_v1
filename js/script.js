const qwerty = document.getElementById("qwerty");
const word = document.getElementById("word");
let missed = 0;

const overlay = document.getElementById("overlay");
const setupForm = document.getElementById("setup-form");
const scoreboard = document.getElementById("scoreboard");

let difficulty;
let lifeIcon;
let currentWord;
let wordArray;

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

  for (const listItem of letterListItems) {
    if (listItem.textContent === letter) {
      listItem.classList.add("show");
      return letter;
    }
  }

  return null;
}

function removeLife() {
  missed++;

  const liveImage = scoreboard.querySelector('img[src*="live"]');
  liveImage.src = liveImage.src.replace("live", "lost");
}

function checkWin() {
  const totalLetters = word.querySelectorAll(".letter").length;
  const revealedLetters = word.querySelectorAll(".show").length;

  if (revealedLetters === totalLetters) {
    overlay.innerHTML = `
      <h2 class="title">You Win!</h2>
      <p>Current Streak: 1</p>
      <p>Best Streak: 1</p>
      <div class="button-container">
        <button class="btn_reset">Play Again</button>
        <button class="btn_home">Home</button>
      </div>
    `;
    overlay.className = "win";
    overlay.style.display = "flex";
  } else if (missed >= 5) {
    overlay.innerHTML = `
      <h2 class="title">You Lose!</h2>
      <p>Best Streak: 1</p>
      <div class="button-container">
        <button class="btn_reset">Try Again</button>
        <button class="btn_home">Home</button>
      </div>
    `;
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

setupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  difficulty = document.getElementById("difficulty").value;
  lifeIcon = document.getElementById("lifeicon").value;

  const lifeImages = scoreboard.querySelectorAll("img");
  lifeImages.forEach((img) => {
    img.src = `./images/live${lifeIcon}.png`;
  });

  wordArray = await getRandomWordAsArray(difficulty);
  addWordToDisplay(wordArray);

  overlay.style.display = "none";
});

qwerty.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    handleInteraction(event.target);
  }
});

document.addEventListener("keydown", (event) => {
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
