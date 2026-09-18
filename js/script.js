const qwerty = document.getElementById("qwerty");
const word = document.getElementById("word");
let missed = 0;

const overlay = document.getElementById("overlay");
const setupForm = document.getElementById("setup-form");
const scoreboard = document.getElementById("scoreboard");

let difficulty;
let lifeIcon;
let currentWord;

const difficultyLengths = { easy: 3, medium: 6, hard: 9 };

async function getRandomWord(level) {
  const wordLength = difficultyLengths[level];

  try {
    const response = await fetch(
      `https://random-word-api.herokuapp.com/word?length=${wordLength}&diff=1`
    );
    const data = await response.json();
    currentWord = data[0];
  } catch (error) {
    console.error("Error fetching random word:", error);
  }
}

setupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  difficulty = document.getElementById("difficulty").value;
  lifeIcon = document.getElementById("lifeicon").value;

  const lifeImages = scoreboard.querySelectorAll("img");
  lifeImages.forEach((img) => {
    img.src = `./images/live${lifeIcon}.png`;
  });

  await getRandomWord(difficulty);

  overlay.style.display = "none";
});
