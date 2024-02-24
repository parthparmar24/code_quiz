// add variables that keep track of the quiz "state"
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// add variables to reference DOM elements
let questionsEl = document.getElementById("questions");
let feedbackEl = document.getElementById("feedback");
let timerEl = document.getElementById("time");

// reference the sound effects
let sfxRight = new Audio("assets/sfx/correct.wav");
let sfxWrong = new Audio("assets/sfx/incorrect.wav");

function startQuiz() {
  // // hide start screen
  // document.getElementById("start-screen").classList.add("hide");

  // // un-hide questions section
  // questionsEl.classList.remove("hide");

  // // start timer
  // timerId = setInterval(clockTick, 1000);

  // // show starting time
  // timerEl.textContent = time;

  // // call a function to show the next question
  // getQuestion();

  // Shuffle the array of questions
  questions = shuffle(questions);

  // hide start screen
  document.getElementById("start-screen").classList.add("hide");

  // un-hide questions section
  questionsEl.classList.remove("hide");

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  // call a function to show the next question
  getQuestion();
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getQuestion() {
  // get current question object from array
  let currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  document.getElementById("question-title").textContent = currentQuestion.title;

  // clear out any old question choices
  document.getElementById("choices").innerHTML = "";

  // loop over the choices for each question
  for (let i = 0; i < currentQuestion.choices.length; i++) {
    // create a new button for each choice
    let choiceButton = document.createElement("button");
    choiceButton.textContent = currentQuestion.choices[i];
    choiceButton.setAttribute("class", "choice");
    choiceButton.setAttribute("value", currentQuestion.choices[i]);

    // display the choice button on the page
    document.getElementById("choices").appendChild(choiceButton);
  }
}

function questionClick(event) {
  // identify the targeted button that was clicked on
  let userChoice = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!userChoice.matches(".choice")) {
    return;
  }

  // check if user guessed wrong
  if (userChoice.value !== questions[currentQuestionIndex].answer) {
    // if they got the answer wrong, penalize time by subtracting 15 seconds from the timer
    time -= 15;

    // if they run out of time (i.e., time is less than zero) set time to zero so we can end quiz
    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timerEl.textContent = time;

    // play "wrong" sound effect
    sfxWrong.play();

    // display "wrong" feedback on page
    feedbackEl.textContent = "Wrong!";
  } else {
    // play "right" sound effect
    sfxRight.play();

    // display "right" feedback on page by displaying the text "Correct!" in the feedback element
    feedbackEl.textContent = "Correct!";
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");

  // after one second, remove the "feedback" class from the feedback element
  setTimeout(function () {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 500);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (currentQuestionIndex === questions.length || time === 0) {
    quizEnd();
  } else {
    getQuestion();
  }
}

// define the steps of the QuizEnd function...when the quiz ends...
function quizEnd() {
  // stop the timer
  clearInterval(timerId);

  // show end screen
  document.getElementById("end-screen").classList.remove("hide");

  // show final score
  document.getElementById("final-score").textContent = time;

  // hide the "questions" section
  questionsEl.classList.add("hide");
}

// add the code in this function to update the time, it should be called every second
function clockTick() {
  // update time
  time--;

  // update the element to display the new time value
  timerEl.textContent = time;

  // check if user ran out of time; if so, call the quizEnd() function
  if (time <= 0) {
    quizEnd();
  }
}

// complete the steps to save the high score
function saveHighScore() {
  // get the value of the initials input box
  let initials = document.getElementById("initials").value.trim();

  // make sure the value of the initials input box wasn't empty
  if (initials !== "") {
    // if it is not, check and see if there is a value of high scores in local storage
    let highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // add the new initials and high score to the array
    highscores.push({ initials: initials, score: time });

    // store the high score in local storage
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect the user to the high scores page
    window.location.href = "highscores.html";
  }
}

// use this function when the user presses the "enter" key when submitting high score initials
function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighScore();
  }
}

// user clicks button to submit initials
document.getElementById("submit").onclick = saveHighScore;

// user clicks button to start quiz
document.getElementById("start").onclick = startQuiz;

// user clicks on an element containing choices
document.getElementById("choices").onclick = questionClick;

// user presses the "enter" key when submitting high score initials
document.getElementById("initials").onkeyup = checkForEnter;
