import { topicsSet } from './topicSets.js'
import { toast, modal } from './mixins.js'
import {
  $titleTopic,
  $lives,
  $tries,
  $score,
  $combo,
  $question,
  $answer,
  $form,
  $containerGame,
  $btnGetLives,
  $btnSkipQuestion,
  $btnBackToMenu,
  userAnswerObj
} from './constants.js'

// States
let lives = 5
let tries = 3
let score = 0
let combo = 0 // increases when the user guesses the answers in a row
let bonusCondition = 5 // combo === bonus condition => reward
let questionPosition = 0 // 0 is the first topic set in topicsSet => questionsSet(array of objects) => 0 is first object(contains question and answer)
let correctAnswerCount = 0
let incorrectAnswerCount = 0
let skippedQuestionsCount = 0

// recovering the position of the topic set from the url
function handleTopicSelected() {
  try {
    const params = new URLSearchParams(window.location.search)
    const topicPosition = params.get('id') // 0, 1, 2, 3...
    const noExistTopicPosition = topicPosition === undefined || topicPosition === null || topicPosition === ''
    if (noExistTopicPosition) return window.location.href = './index.html'

    const topicSelectedByUser = topicsSet[topicPosition] // injecting the postion of the topic set selected in the array of topics
    const { questionsSet } = topicSelectedByUser

    handleTitleTopic(topicSelectedByUser)
    renderUI(questionsSet)
    handleEventListeners(questionsSet)
  } catch (error) {
    console.error(error)
    alert(`Ha habido un error: \n ${error}`)
    window.location.href = './index.html'
  }
}

// make the document and game title dynamic
function handleTitleTopic(topicSet) {
  const { topic } = topicSet
  document.title = `Preguntas sobre ${topic}`
  $titleTopic.textContent = topic
}

// render the states and the question in the UI, reset the object to prevent the user from submitting the same response multiple times
function renderUI(questionsSet) {
  const question = questionsSet[questionPosition].question

  $lives.textContent = lives
  $tries.textContent = tries
  $score.textContent = score
  $combo.textContent = combo
  $question.textContent = question
  $form.reset()
  userAnswerObj.userAnswer = ''
}

// assign events to read the user value and when submit the answer
function handleEventListeners(questionsSet) {
  $answer.addEventListener('input', handleUserAnswer)
  $form.addEventListener('submit', event => validateAnswer(event, questionsSet))
  $btnGetLives.addEventListener('click', () => handleGetLives(questionsSet))
  $btnSkipQuestion.addEventListener('click', () => handleSkipQuestion(questionsSet))
  $btnBackToMenu.addEventListener('click', handleBackToMenu)
}

// pass the user answer to an object
function handleUserAnswer(event) {
  userAnswerObj.userAnswer = event.target.value.trim().toLowerCase()
}

// validate the user answer and make decisions consequently
function validateAnswer(event, questionsSet) {
  event.preventDefault()

  const answer = questionsSet[questionPosition].answer
  const { userAnswer } = userAnswerObj
  const emptyValue = userAnswer === ''
  const isCorrectAnswer = answer.find(answer => answer.toLowerCase() === userAnswer)
  const isIncorrectAnswer = userAnswer !== isCorrectAnswer

  if (emptyValue) return toast.fire({ title: 'Debes introducir una respuesta', background: '#da3a3a' })
  if (isCorrectAnswer) return handleCorrectAnswer(questionsSet)
  if (isIncorrectAnswer) return handleIncorrectAnswer(questionsSet)
}

function handleGetLives(questionsSet) {
  const userHasNoScoreAvailable = score < 100
  if (userHasNoScoreAvailable) return toast.fire({ title: 'No tienes puntos suficientes', background: '#da3a3a' })

  modal.fire({
    titleText: '¿Quieres cambiar 100 puntos por 1 vida?',
    text: 'Esta acción no se puede deshacer',
    confirmButtonText: 'Sí, cambiar',
  }).then(result => {
    if (result.isConfirmed) {
      score -= 100
      lives++
      renderUI(questionsSet)
    }
  })
}

// check if the user can skip the question, check if the user is in the last question, then modify the states
function handleSkipQuestion(questionsSet) {
  const limitSkip = 3
  const isQuestionNotSkippable = skippedQuestionsCount === limitSkip || lives === 0
  if (isQuestionNotSkippable) return toast.fire({ title: 'No puedes saltarte más preguntas', background: '#da3a3a', })

  modal.fire({
    titleText: '¿Estás seguro que quieres saltarte la pregunta?',
    text: 'Esta acción no se puede deshacer',
    confirmButtonText: 'Sí, saltar pregunta',
  }).then(result => {
    if (result.isConfirmed) {
      incorrectAnswerCount++
      lives--

      const isLastQuestion = questionPosition + 1 === questionsSet.length
      if (isLastQuestion) return handleFinishGame()

      combo = 0
      tries = 3
      skippedQuestionsCount++
      questionPosition++
      toast.fire({ title: 'Has saltado la pregunta: -1 vida', background: '#da3a3a' })
      renderUI(questionsSet)
    }
  })
}

function handleBackToMenu() {
  modal.fire({
    titleText: '¿Estás seguro de volver al menú?',
    text: 'Perderás todo el progreso',
    confirmButtonText: 'Sí, volver al menú',
  }).then(result => {
    if (result.isConfirmed) window.location.href = './index.html'
  })
}

// modify states, check if the user is in last question
function handleCorrectAnswer(questionsSet) {
  score += 10
  tries = 3
  combo++
  correctAnswerCount++

  if (combo === bonusCondition) return handleUserReward(questionsSet)
  toast.fire({ title: '+10 Puntos & +1 Combo', background: '#5bbd63' })

  const isLastQuestion = questionPosition + 1 === questionsSet.length
  if (isLastQuestion) return handleFinishGame()

  questionPosition++
  renderUI(questionsSet)
}

// check if user has tries or lives to keep playing, states are modify if not
function handleIncorrectAnswer(questionsSet) {
  const userHasNoLivesAndTries = lives === 0 && tries === 1
  const userHasNoTries = tries === 1
  if (userHasNoLivesAndTries) return handleGameOver()
  if (userHasNoTries) return handleFailedQuestion(questionsSet)

  tries--
  toast.fire({ title: 'Respuesta incorrecta: -1 intento', background: '#da3a3a' })
  renderUI(questionsSet)
}

// modify states, show answer, check if the user is in the last question
function handleFailedQuestion(questionsSet) {
  lives--
  incorrectAnswerCount++

  const correctAnswer = questionsSet[questionPosition].answer[0]
  toast.fire({ title: `Pregunta Fallida: -1 vida \n Respuesta: ${correctAnswer}`, background: '#da3a3a' })

  const isLastQuestion = questionPosition + 1 === questionsSet.length
  if (isLastQuestion) return handleFinishGame()

  tries = 3
  combo = 0
  questionPosition++
  renderUI(questionsSet)
}

// modify states, check if the user is in the last question
function handleUserReward(questionsSet) {
  lives++
  score += 50
  toast.fire({ title: `Has encadenado ${combo} respuestas seguidas \n Recibes 1 vida y 50 puntos`, background: '#582c8a', })

  const isLastQuestion = questionPosition + 1 === questionsSet.length
  if (isLastQuestion) return handleFinishGame()

  combo = 0
  bonusCondition++
  questionPosition++
  renderUI(questionsSet)
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
      <a href="./index.html" class="btn btn-back-to-menu">Volver al menú</a>
    </div>
  `)
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
      <a href="./index.html" class="btn btn-back-to-menu">Volver al menú</a>
    </div>
  `)
}

// Game Init
handleTopicSelected()
