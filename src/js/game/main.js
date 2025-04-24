import Swal from 'sweetalert2'
import { topicsSet } from './topicSets.js';
import { $titleTopic, $lives, $tries, $score, $combo, $question, $answer, $form, userAnswerObj } from './constants.js';


// States
const conditionBonus = 5;
let lives = 5;
let tries = 3;
let score = 0;
let combo = 0; // if user answered correctly 5 times in a row the user receives a bonus (+1 live and +50 score)
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

  //$answer.addEventListener('input', handleUserAnswer)
  $form.addEventListener('submit', event => validateAnswer(event, questionsSet));
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

  $answer.value = '';
  $form.reset();
}

function validateAnswer(event, questionsSet) {
  event.preventDefault();

  const userAnswer = $answer.value.toLowerCase().trim();
  const correctAnswer = questionsSet[questionPosition].answer.toLowerCase().trim();
  const isCorrectAnswer = userAnswer === correctAnswer;
  const isIncorrectAnswer = userAnswer !== correctAnswer;

  if (isCorrectAnswer) return handleCorrectAnswer(questionsSet);
  if (isIncorrectAnswer) return handleIncorrectAnswer(questionsSet);
}

function handleCorrectAnswer(questionsSet) {
  score += 10;
  combo += 1;
  tries = 3;

  if (combo === conditionBonus) return handleConditionBonus(questionsSet);
  if (questionPosition + 1 === questionsSet.length) return handleFinishGame();

  questionPosition += 1;
  renderTopicSelected(questionsSet);
}

function handleConditionBonus(questionsSet) {
  Swal.fire({ title: "!Felicidades!", text: "Has conseguido un bonus de 1 vida y 50 puntos" });
  lives++;
  score += 50;
  combo = 0;

  if (questionPosition + 1 === questionsSet.length) return handleFinishGame();

  questionPosition++;
  renderTopicSelected(questionsSet);
}

//Game Init
window.addEventListener('load', () => $form.reset());
handleTopicSelected();