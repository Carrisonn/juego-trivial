import { topicsSet } from './game/questionSets.js';


function createTopicCards() {
  topicsSet.forEach(topic => {
    const $topicCard = document.createElement('div');
    $topicCard.classList.add('topic-card');

    const $topicImg = document.createElement('img');
    $topicImg.src = topic[0].img;
    $topicImg.alt = `Tema ${topic[0].topic}`;
    $topicImg.title = `Tema ${topic[0].topic}`;
    $topicImg.loading = 'lazy';

    const $topicLink = document.createElement('a');
    $topicLink.classList.add('btn');
    $topicLink.textContent = topic[0].topic;
    $topicLink.dataset.topic = topic[0].id;
    $topicLink.href = '../game.html';
    $topicLink.target = '_blank';
    //$topicLink.addEventListener('click', handleTopicClick);

    $topicCard.appendChild($topicImg);
    $topicCard.appendChild($topicLink);
    document.querySelector('.topics-container').appendChild($topicCard);
  });
}

createTopicCards();