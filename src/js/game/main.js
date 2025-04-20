import { topicsSet } from './topicSets.js';
import { $titleTopic, $lives, $tries, $score, $combo, $question } from './constants.js';


// States
const conditionBonus = 5;
let lives = 5;
let tries = 3;
let score = 0;
let combo = 0; // if user answered correctly 5 times in a row increases lives in 1 and bonus 50
let questionPosition = 0; // topic object => questionsSet is array of objects => 0 is first object(contains question and answer)



function handleTopicSelected() {
  const params = new URLSearchParams(window.location.search);
  const topicPosition = params.get('id');
  const noExitsTopicPosition = topicPosition === undefined || topicPosition === null || topicPosition === '';
  if (noExitsTopicPosition) return false;

  const topicSelected = topicsSet[topicPosition];
  return topicSelected;
}

function handleTitleTopic(topicSet) {
  const { topic } = topicSet;
  document.title = `${topic} - Carrison`;
  $titleTopic.textContent = topic;
}

//Game Init
(async () => {
  const topicSelected = await handleTopicSelected();
  if (!topicSelected) return window.location.href = '../index.html';

  function renderTopicSelected() {
    const { questionsSet } = topicSelected;
    const question = questionsSet[questionPosition].question;

    $lives.textContent = lives;
    $tries.textContent = tries;
    $score.textContent = score;
    $combo.textContent = combo;
    $question.textContent = question;
  }

  handleTitleTopic(topicSelected);
  renderTopicSelected();
})();

