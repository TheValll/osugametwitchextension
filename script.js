const start = document.querySelector("#start-btn");
const stopBtn = document.querySelector("#stop-btn");
const background_map = document.querySelector(".background-map");
const background_map_div = document.querySelector(".background-map-div");
const background_game = document.querySelector(".background");
const time_select = document.querySelector("#time-select");
const error = document.querySelector("#error-span");
const user = document.querySelector("#user-input");
const inGameInfos = document.querySelector(".in-game-infos");
const time_count = document.querySelector("#time-count");
const inGameInfosScore = document.querySelector("#score");
const currentScore = document.querySelector("#current-score");
const maxScore = document.querySelector("#max-score");

let questionsCounter = 0;
let questionsNumber = 5;
let score = 0;
let currentQuestion = null;
let gameTimer = null;
let remainingTime = 0;
let maps = null;

start.addEventListener("click", (e) => {
  e.preventDefault();
  if (time_select.value === "") {
    error.innerHTML = "Select a timer option";
  } else {
    error.innerHTML = "";
    questionsCounter = 0;
    score = 0;
    time_count.innerHTML = time_select.value;
    removeInGameEl();
    game();
  }
});

stopBtn.addEventListener("click", (e) => {
  e.preventDefault();
  AddInGameEl();
  error.innerHTML = "Game stopped.";
  clearInterval(gameTimer);
});

async function game() {
  maps = await getMaps();

  maxScore.innerHTML = questionsNumber;
  currentScore.innerHTML = score;
  nextQuestion();

  user.addEventListener("keydown", handleUserInput);
}

function handleUserInput(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const userGuess = user.value.trim();

    if (userGuess === "") {
      error.innerHTML = "Please enter an answer!";
      return;
    }

    const correct = compareString(userGuess, currentQuestion.answer);

    if (correct) {
      score += 1;
      currentScore.innerHTML = score;
      clearInterval(gameTimer);
      questionsCounter += 1;
      if (questionsCounter < questionsNumber) {
        nextQuestion();
      } else {
        endGame();
      }
    } else {
      error.innerHTML = `Incorrect !.`;
    }
    user.value = "";
  }
}

function nextQuestion() {
  currentQuestion = getRandomMap();
  background_game.style.backgroundImage = `url(${currentQuestion.path})`;
  background_game.style.backgroundSize = "cover";
  background_game.style.backgroundRepeat = "no-repeat";
  background_game.style.backgroundPosition = "center";
  background_game.style.filter = "blur(5px)";

  remainingTime = parseInt(time_select.value);
  time_count.innerHTML = remainingTime;
  startTimer();
}

function endGame() {
  AddInGameEl();
  error.innerHTML = `Finish ! Your score: ${score}/${questionsNumber}`;
  clearInterval(gameTimer);
}

function startTimer() {
  gameTimer = setInterval(() => {
    remainingTime -= 1;
    time_count.innerHTML = remainingTime;

    let blurValue = (5 * remainingTime) / parseInt(time_select.value);
    background_game.style.filter = `blur(${blurValue}px)`;

    if (remainingTime <= 0) {
      clearInterval(gameTimer);
      error.innerHTML = `Time's up ! The correct answer was "${currentQuestion.answer}".`;
      questionsCounter += 1;

      if (questionsCounter < questionsNumber) {
        nextQuestion();
      } else {
        endGame();
      }
    }
  }, 1000);
}

function getRandomMap() {
  const keys = Object.keys(maps);
  const randomIndex = Math.floor(Math.random() * keys.length);

  const answer = maps[randomIndex]["title"];
  const path = maps[randomIndex]["path"];

  return { answer, path };
}

function compareString(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

function removeInGameEl() {
  time_select.style.display = "none";
  inGameInfos.style.display = "flex";
  start.style.display = "none";
  stopBtn.style.display = "block";
  background_map_div.style.display = "none";
  background_game.style.display = "block";
}

function AddInGameEl() {
  time_select.style.display = "block";
  inGameInfos.style.display = "none";
  start.style.display = "block";
  stopBtn.style.display = "none";
  background_game.style.display = "none";
  background_map_div.style.display = "flex";
  background_map.src = "default_bg.jpg";
}

async function getMaps() {
  const reponse = await fetch("./maps.json");
  const maps = await reponse.json();

  return maps;
}
