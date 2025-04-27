import { topicsSet } from './topicSets.js';
import { $titleTopic, $lives, $tries, $score, $combo, $question, $answer, $form, userAnswerObj } from './constants.js';
import { bonusToast, correctAnswerToast, errorToast } from './toasts.js';


// States
let lives = 5;
let tries = 3;
let score = 0;
let combo = 0; // increases when the user guesses the answers in a row
let bonusCondition = 5;  // combo === bonus condition => reward
let questionPosition = 0; // topic object => questionsSet is array of objects => 0 is first object(contains question and answer)


// recovering the position of the topic set from the url
function handleTopicSelected() {
  const params = new URLSearchParams(window.location.search);
  const topicPosition = params.get('id'); // 0, 1, 2, 3...
  const noExitsTopicPosition = topicPosition === undefined || topicPosition === null || topicPosition === '';
  if (noExitsTopicPosition) return window.location.href = './index.html';

  const topicSelectedByUser = topicsSet[topicPosition]; // injecting the postion of the topic set selected in the array of topics
  const { questionsSet } = topicSelectedByUser

  handleTitleTopic(topicSelectedByUser);
  renderTopicSelected(questionsSet);
  handleEventListeners(questionsSet)
}

function handleTitleTopic(topicSet) {
  const { topic } = topicSet;
  document.title = `Preguntas sobre ${topic}`;
  $titleTopic.textContent = topic;
}

function renderTopicSelected(questionsSet) {
  const question = questionsSet[questionPosition].question;

  $lives.textContent = lives;
  $tries.textContent = tries;
  $score.textContent = score;
  $combo.textContent = combo;
  $question.textContent = question;

  userAnswerObj.userAnswer = '';
  $form.reset();
}

function handleEventListeners(questionsSet) {
  $answer.addEventListener('input', handleUserAnswer)
  $form.addEventListener('submit', event => validateAnswer(event, questionsSet));
}

function handleUserAnswer(event) {
  userAnswerObj.userAnswer = event.target.value.trim().toLowerCase();
}

function validateAnswer(event, questionsSet) {
  event.preventDefault();

  const correctAnswer = questionsSet[questionPosition].answer.toLowerCase().trim();
  const { userAnswer } = userAnswerObj
  const emptyValue = userAnswer === '';
  const isCorrectAnswer = userAnswer === correctAnswer;
  //const isIncorrectAnswer = userAnswer !== correctAnswer;

  if (emptyValue) return errorToast.fire({ title: 'Debes introducir una respuesta' });
  if (isCorrectAnswer) return handleCorrectAnswer(questionsSet);
  //if (isIncorrectAnswer) return handleIncorrectAnswer(questionsSet);
}

function handleCorrectAnswer(questionsSet) {
  correctAnswerToast.fire({ title: '+10 Puntos' });
  score += 10;
  combo += 1;
  tries = 3;

  if (combo === bonusCondition) return handleUserReward(questionsSet);
  if (questionPosition + 1 === questionsSet.length) return handleFinishGame();

  questionPosition++;
  renderTopicSelected(questionsSet);
}

//function handleIncorrectAnswer(questionsSet) {
//  console.log('INCORRECT ANSWER');
//}

function handleUserReward(questionsSet) {
  bonusToast.fire({ title: `Has conseguido encadenar ${combo} respuestas seguidas, recibes 1 vida y 50 puntos` });
  lives++;
  score += 50;

  if (questionPosition + 1 === questionsSet.length) return handleFinishGame();
  combo = 0;
  bonusCondition += 2;
  questionPosition++;
  renderTopicSelected(questionsSet);
}

//function handleFinishGame() {
//  console.log('FINISH GAME');
//}

//Game Init
window.addEventListener('load', () => $form.reset());
handleTopicSelected();