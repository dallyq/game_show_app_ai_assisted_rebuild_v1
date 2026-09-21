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
