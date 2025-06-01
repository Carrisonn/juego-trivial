import { topicsSet } from './game/topicSets.js';

function createTopicCards() {
  const $topicContainer = document.querySelector('.topics-container');

  topicsSet.forEach((topicObj, index) => {
    const { topic, img } = topicObj;

    const $topicCard = document.createElement('div');
    $topicCard.classList.add('topic-card');

    const $topicImg = document.createElement('img');
    $topicImg.src = img;
    $topicImg.alt = `Imagen sobre ${topic}`;
    $topicImg.title = `Temática sobre ${topic}`;
    $topicImg.loading = 'lazy';

    const $topicLink = document.createElement('a');
    $topicLink.classList.add('btn', 'btn-topic');
    $topicLink.textContent = topic;
    $topicLink.href = `./game.html?id=${index}`;

    $topicCard.append($topicImg);
    $topicCard.append($topicLink);
    $topicContainer.append($topicCard);
  });
}

createTopicCards();