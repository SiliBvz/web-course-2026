

let secretNumber = "";
let attempts = [];
let attemptCount = 0;
let gameOver = false;



const formEl = document.getElementById("game-form");
const inputEl = document.getElementById("guess-input");
const messageEl = document.getElementById("message");
const counterEl = document.getElementById("counter");
const historyEl = document.getElementById("history");
const newGameBtn = document.getElementById("new-game");


function generateNumber() {
  let number = String(Math.floor(Math.random() * 9) + 1);
  while (number.length < 4) {
    const digit = Math.floor(Math.random() * 10);

    if (!number.includes(String(digit))) {
      number += digit;
    }
  }

  return number;
}




function validateGuess(guess) {

  if (guess.length !== 4) {
    return false;
  }

  for (let i = 0; i < guess.length; i++) {

    if (guess[i] < "0" || guess[i] > "9") {
      return false;
    }

    for (let j = i + 1; j < guess.length; j++) {
      if (guess[i] === guess[j]) {
        return false;
      }
    }
  }

  return true;
}



function checkGuess(guess) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < 4; i++) {

    if (guess[i] === secretNumber[i]) {
      bulls++;
    }
    else if (secretNumber.includes(guess[i])) {
      cows++;
    }
  }

  return { bulls: bulls, cows: cows };
}



function render() {
  historyEl.innerHTML = "";

  attempts.forEach(attempt => {
    const li = document.createElement("li");

    li.textContent =
      attempt.guess + " → " +
      attempt.bulls + " быков, " +
      attempt.cows + " коров";

    historyEl.appendChild(li);
  });

  counterEl.textContent = "Попыток: " + attemptCount;
}


formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  if (gameOver) {
    return;
  }

  const guess = inputEl.value.trim();

  if (!validateGuess(guess)) {
    messageEl.textContent = "Введите 4 разные цифры!";
    return;
  }

  messageEl.textContent = "";

  const result = checkGuess(guess);

  attemptCount++;

  attempts.push({
    guess: guess,
    bulls: result.bulls,
    cows: result.cows
  });

  render();

  inputEl.value = "";
  inputEl.focus();

  if (result.bulls === 4) {
    gameOver = true;

    messageEl.textContent =
      "Победа! Угадано за " + attemptCount + " попыток";

    inputEl.disabled = true;
    formEl.querySelector("button").disabled = true;
  }
});



function newGame() {
  secretNumber = generateNumber();

  attempts = [];
  attemptCount = 0;
  gameOver = false;

  inputEl.disabled = false;
  formEl.querySelector("button").disabled = false;

  inputEl.value = "";
  messageEl.textContent = "";

  render();
  inputEl.focus();
}



newGameBtn.addEventListener("click", newGame);



newGame();