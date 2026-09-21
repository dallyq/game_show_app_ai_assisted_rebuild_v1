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
    return data;
  } catch (error) {
    console.error("Error loading word list:", error);
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

  wordArray = await getRandomWordAsArray(difficulty);

  overlay.style.display = "none";
});
