import { topicsSet } from './topicSets.js';
import { $titleTopic, $lives, $tries, $score, $combo, $question, $answer, $form, $containerGame, userAnswerObj } from './constants.js';
import { bonusToast, correctAnswerToast, errorToast } from './toasts.js';


// States
let lives = 3;
let tries = 3;
let score = 0;
let combo = 0; // increases when the user guesses the answers in a row
let bonusCondition = 5;  // combo === bonus condition => reward
let questionPosition = 0; // topic object => questionsSet is array of objects => 0 is first object(contains question and answer)
let correctAnswerCount = 0;
let incorrectAnswerCount = 0;


// recovering the position of the topic set from the url
function handleTopicSelected() {
  try {
    const params = new URLSearchParams(window.location.search);
    const topicPosition = params.get('id'); // 0, 1, 2, 3...
    const noExistTopicPosition = topicPosition === undefined || topicPosition === null || topicPosition === '';
    if (noExistTopicPosition) return window.location.href = './index.html';

    const topicSelectedByUser = topicsSet[topicPosition]; // injecting the postion of the topic set selected in the array of topics
    const { questionsSet } = topicSelectedByUser;

    handleTitleTopic(topicSelectedByUser);
    renderTopicSelected(questionsSet);
    handleEventListeners(questionsSet)
  } catch (error) {
    console.error(error)
    alert(`Ha habido un error: ${error}`);
    window.location.href = './index.html';
  }
}

// make the document and game title dynamic
function handleTitleTopic(topicSet) {
  const { topic } = topicSet;
  document.title = `Preguntas sobre ${topic}`;
  $titleTopic.textContent = topic;
}

// render the states and the question in the UI, reset the object to prevent the user from submitting the same response multiple times
function renderTopicSelected(questionsSet) {
  const question = questionsSet[questionPosition].question;

  $lives.textContent = lives;
  $tries.textContent = tries;
  $score.textContent = score;
  $combo.textContent = combo;
  $question.textContent = question;
  $form.reset();
  userAnswerObj.userAnswer = '';
}

// assign events to read the user value and when submit the answer
function handleEventListeners(questionsSet) {
  $answer.addEventListener('input', handleUserAnswer)
  $form.addEventListener('submit', event => validateAnswer(event, questionsSet));
}

// pass the user answer to an object
function handleUserAnswer(event) {
  userAnswerObj.userAnswer = event.target.value.trim().toLowerCase();
}

// validate the user answer and make decisions consequently
function validateAnswer(event, questionsSet) {
  event.preventDefault();

  const correctAnswer = questionsSet[questionPosition].answer.toLowerCase().trim();
  const { userAnswer } = userAnswerObj
  const emptyValue = userAnswer === '';
  const isCorrectAnswer = userAnswer === correctAnswer;
  const isIncorrectAnswer = userAnswer !== correctAnswer;

  if (emptyValue) return errorToast.fire({ title: 'Debes introducir una respuesta' });
  if (isCorrectAnswer) return handleCorrectAnswer(questionsSet);
  if (isIncorrectAnswer) return handleIncorrectAnswer(questionsSet);
}

// modify states, check if the user is in last question 
function handleCorrectAnswer(questionsSet) {
  score += 10;
  combo += 1;
  tries = 3;
  correctAnswerCount++;
  correctAnswerToast.fire({ title: '+10 Puntos & +1 Combo' });

  if (combo === bonusCondition) return handleUserReward(questionsSet);
  const isLastQuestion = questionPosition + 1 === questionsSet.length;
  if (isLastQuestion) return handleFinishGame();

  questionPosition++;
  renderTopicSelected(questionsSet);
}

// check if user has tries or lives to keep playing, states are modify if not
function handleIncorrectAnswer(questionsSet) {
  const userHasNoLivesAndTries = lives === 0 && tries === 1;
  const userHasNoTries = tries === 1;
  if (userHasNoLivesAndTries) return handleGameOver();
  if (userHasNoTries) return handleFailedQuestion(questionsSet);

  tries--;
  errorToast.fire({ title: 'Respuesta incorrecta' });
  renderTopicSelected(questionsSet);
}

// modify states, check if the user is in the last question
function handleFailedQuestion(questionsSet) {
  lives--;
  incorrectAnswerCount++;
  errorToast.fire({ title: '-1 vida' });

  const isLastQuestion = questionPosition + 1 === questionsSet.length;
  if (isLastQuestion) return handleFinishGame();

  tries = 3;
  combo = 0;
  questionPosition++;
  renderTopicSelected(questionsSet);
}

// modify states, check if the user is in the last question
function handleUserReward(questionsSet) {
  lives++;
  score += 50;
  bonusToast.fire({ title: `Has encadenado ${combo} respuestas seguidas, recibes 1 vida y 50 puntos` });

  const isLastQuestion = questionPosition + 1 === questionsSet.length;
  if (isLastQuestion) return handleFinishGame();

  combo = 0;
  bonusCondition++;
  questionPosition++;
  renderTopicSelected(questionsSet);
}

// create the finish game section
function handleFinishGame() {
  $containerGame.setHTMLUnsafe(`
    <div class="container-game-finished">
      <h1>¡Felicidades!</h1>
      <p>Has llegado al final, a continuación se te muestran tus estadísticas</p>
      <div class="container-final-stats">
        <p class="score">Puntos Totales: ${score}</p>
        <p class="lives">Vidas Restantes: ${lives}</p>
        <p class="correct-answer-count">Preguntas Correctas: ${correctAnswerCount} </p>
        <p class="incorrect-answer-count">Preguntas Incorrectas: ${incorrectAnswerCount} </p>
      </div>
      <!--<button class="btn btn-back-to-menu" onclick="window.location.href = './index.html'">Volver al menú</button>-->
    </div>
  `);
}

// create the game over section
function handleGameOver() {
  $containerGame.setHTMLUnsafe(`
    <div class="container-game-finished">
      <h1>¡Game Over!</h1>
      <p>Has perdido, a continuación se te muestran tus estadísticas</p>
      <div class="container-final-stats">
        <p class="score">Puntos Totales: ${score}</p>
        <p class="lives">Vidas Restantes: ${lives}</p>
        <p class="correct-answer-count">Preguntas Correctas: ${correctAnswerCount} </p>
        <p class="incorrect-answer-count">Preguntas Incorrectas: ${incorrectAnswerCount} </p>
      </div>
      <!--<button class="btn btn-back-to-menu" onclick="window.location.href = './index.html'">Volver al menú</button>-->
    </div>
  `);
}

//Game Init
handleTopicSelected();