// ===== Элементы страницы =====
const pads = document.querySelectorAll(".pad");
const startButton = document.getElementById("start-button");
const levelElement = document.getElementById("level");
const messageElement = document.getElementById("message");

// ===== Настройки времени (мс) =====
const LIGHT_TIME = 500; // сколько горит кнопка
const PAUSE_TIME = 200; // пауза между кнопками

// ===== Состояние игры =====
const game = {
  sequence: [], // загаданная последовательность, например [2, 0, 3]
  playerStep: 0, // какой элемент игрок сейчас должен нажать
  mode: "idle", // "idle" - не начата, "show" - показ, "input" - ход игрока, "over" - проигрыш
  timerId: null // id текущего таймера, нужен чтобы его отменить
};

// ===== Вспомогательные функции =====

// Включить или выключить все кнопки
function setPadsEnabled(enabled) {
  pads.forEach((pad) => {
    pad.disabled = !enabled;
  });
}

// Отменить текущий таймер (если он есть)
function stopTimer() {
  clearTimeout(game.timerId);
  game.timerId = null;
}

// Добавить в последовательность один случайный элемент (0-3)
function addRandomStep() {
  const randomIndex = Math.floor(Math.random() * 4);
  game.sequence.push(randomIndex);
  levelElement.textContent = game.sequence.length;
}

// ===== Основная логика =====

// Нажатие на «Старт»
function startGame() {
  stopTimer(); // останавливаем старую игру, если она шла
  pads.forEach((pad) => pad.classList.remove("active"));

  game.sequence = [];
  game.playerStep = 0;
  addRandomStep();
  showSequence();
}

// Показ последовательности: по одному элементу с паузами
function showSequence() {
  game.mode = "show";
  setPadsEnabled(false);
  messageElement.textContent = "Запоминайте последовательность...";

  let i = 0; // номер элемента, который показываем сейчас

  // Функция показывает один элемент и вызывает сама себя для следующего
  function showNext() {
    // Все элементы показаны - ход игрока
    if (i >= game.sequence.length) {
      game.mode = "input";
      setPadsEnabled(true);
      messageElement.textContent = "Ваш ход! Повторите последовательность.";
      return;
    }

    const pad = pads[game.sequence[i]];
    pad.classList.add("active");

    // Через LIGHT_TIME гасим кнопку
    game.timerId = setTimeout(() => {
      pad.classList.remove("active");
      i++;

      // Через PAUSE_TIME показываем следующую кнопку
      game.timerId = setTimeout(showNext, PAUSE_TIME);
    }, LIGHT_TIME);
  }

  showNext();
}

// Клик по кнопке
function handlePadClick(event) {
  // Клики засчитываются только когда ход игрока
  if (game.mode !== "input") {
    return;
  }

  const clickedIndex = Number(event.currentTarget.dataset.index);
  const expectedIndex = game.sequence[game.playerStep];

  // Ошибка - игра окончена
  if (clickedIndex !== expectedIndex) {
    gameOver();
    return;
  }

  game.playerStep++;

  // Вся последовательность введена верно - добавляем шаг и показываем заново
  if (game.playerStep === game.sequence.length) {
    game.playerStep = 0;
    setPadsEnabled(false);
    addRandomStep();
    showSequence();
  }
}

// Конец игры
function gameOver() {
  stopTimer();
  game.mode = "over";
  setPadsEnabled(false);
  messageElement.textContent =
    `Ошибка! Вы дошли до уровня ${game.sequence.length}. Нажмите «Старт», чтобы начать заново.`;
}

// ===== Подключение обработчиков =====
startButton.addEventListener("click", startGame);

pads.forEach((pad) => {
  pad.addEventListener("click", handlePadClick);
});