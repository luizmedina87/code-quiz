// question objects to use. Should change to json file afterwards
questions = [
  question1 = {
    question: "What option is 3?",
    options: ["1", "2", "3"],
    indexCorrect: 2
  },
  question2 = {
    question: "what option is 4?",
    options: ["1", "2", "3", "4"],
    indexCorrect: 3
  }
];

var pageContentEl = document.getElementById("page-content");
var buttonsListUlEl = document.getElementById("buttons-list");
var currentQuestion = 0;
var continueTimer = false;


var decreaseTimer = function(seconds) {
  var timeLeftEl = document.getElementById("time-left");
  var timeLeft = parseInt(timeLeftEl.textContent);
  timeLeft -= seconds;
  timeLeftEl.textContent = timeLeft;
}

var countdownTimer = function() {
  // getting time left
  var timeLeftEl = document.getElementById("time-left");
  var timeLeft = parseInt(timeLeftEl.textContent);
  const timer = setInterval(updateTime, 1000);
  function updateTime() {
    // continue going if there is time left and the test is not over
    if (continueTimer) {
      if ((timeLeft > 0) && continueTimer) {
        // updating time left
        decreaseTimer(1);
      }
      else {
        clearInterval(timer)
      }
    }
  }
};

var mainButtonHandler = function(event) {
  var targetEl = event.target;
  // things only happen if the user clicks a button
  if (targetEl.nodeName == "BUTTON") {
    // if the user clicks the start button, it should start the game
    if (targetEl.matches("#start-btn")) {
      startQuiz();
    }
    // if the user clicks submit, it should save the score
    else if (targetEl.matches("#submit-btn")) {
      submitScore();
    }
    // if it is an option button, check if it is the last question
    else if (currentQuestion < (questions.length - 1)) {
      checkAnswer(targetEl);
      // cleaning up the screen and going to next question
      document.getElementById("buttons-list").textContent = "";
      currentQuestion++;
      // setting up next question
      showQuestion();
    }
    // if there are no more questions, end quiz
    else {
      checkAnswer(targetEl);
      endQuiz();
    }
  }
};

var startQuiz = function() {
  // title class should change to change css formatting
  var quizTitleEl = document.getElementById("quiz-title");
  quizTitleEl.className = "question-title";
  // <p> should disappear because questions don't need it
  var quizInstEl = document.getElementById("quiz-instructions");
  quizInstEl.remove();
  // delete start quiz button
  var quizBtnEl = document.getElementById("start-btn");
  quizBtnEl.parentElement.remove();
  // start timer
  continueTimer = true;
  // should enter question mode
  showQuestion();
}

var showQuestion = function() {
  // unpack content
  var questionObj = questions[currentQuestion];
  var question = questionObj.question;
  var options = questionObj.options;
  // change <h2> text content to new question
  var quizTitleEl = document.getElementById("quiz-title");
  quizTitleEl.textContent = question;
  // add options buttons
  for (let i = 0; i < options.length; i++) {
    let optionTxt  = options[i];
    var btnsListEl = document.getElementById("buttons-list");
    // create <li>
    var listEl = document.createElement("li");
    listEl.className = "btn";
    // create <button>
    var btnEl = document.createElement("button");
    btnEl.setAttribute("id", i);
    btnEl.textContent = optionTxt;
    // append <button> to <li>
    listEl.appendChild(btnEl);
    // append <li> to <ul>
    btnsListEl.appendChild(listEl);
  }  
};

var checkAnswer = function(buttonClickedEl) {
  var chosenAnswer = parseInt(buttonClickedEl.id);
  var rightAnswer = questions[currentQuestion].indexCorrect;
  if (chosenAnswer === rightAnswer) {
    informUser("Right");
  }
  else {
    decreaseTimer(10);
    informUser("Wrong");
  }
}

var informUser = function(informText) {
  var mainEl = document.getElementById("page-content");
  var answerCorrectnessEl = document.getElementById("answer-correctness");
  // if the element doesn't exist, it will create one
  if (!answerCorrectnessEl) {
    var answerCorrectnessEl = document.createElement("p");
    answerCorrectnessEl.id = "answer-correctness";
    mainEl.appendChild(answerCorrectnessEl);
  }
  answerCorrectnessEl.textContent = informText;
};

var endQuiz = function() {
  // stop timer
  continueTimer = false;
  // geting page content
  var pageContentEl = document.getElementById("page-content");
  // clearing the buttons from the page
  var buttonsListUlEl = document.getElementById("buttons-list");
  buttonsListUlEl.remove();
  // informing user the quiz is over
  var quizTitleEl = document.getElementById("quiz-title");
  quizTitleEl.textContent = "All done!";
  // getting score
  var timeLeftEl = document.getElementById("time-left");
  var timeLeft = parseInt(timeLeftEl.textContent);
  var finalScoreEl = document.createElement("p");
  finalScoreEl.textContent = "Your score is " + timeLeft;
  pageContentEl.appendChild(finalScoreEl);
  // creating initials form
  var enterInitialsEl = document.createElement("form");
  enterInitialsEl.innerHTML = `
    <label for='initials'>Enter initials:</label>
    <input type='text' id='initials' name='initials' class='form-input'/>
  `;
  pageContentEl.appendChild(enterInitialsEl);
  // creating submit button
  var submitButtonEl = document.createElement("button");
  submitButtonEl.setAttribute("id", "submit-btn");
  submitButtonEl.textContent = "Submit";
  pageContentEl.appendChild(submitButtonEl);
  // placing correctness message as last element
  var answerCorrectnessEl = document.getElementById("answer-correctness");
  pageContentEl.appendChild(answerCorrectnessEl);
}

var submitScore = function () {
  // try to get saved scores from local storage
  var savedScores = localStorage.getItem("scores");
  savedScores = JSON.parse(savedScores);
  // get data from user
  highScore = getUserData();
  // if there aren't any, create a list with scores, otherwise append
  if (!savedScores) {
    savedScores = [highScore];
  }
  else {
    savedScores.push(highScore);
  }
  // save score
  localStorage.setItem("scores", JSON.stringify(savedScores))
  // SEND USER TO HIGH SCORES PAGE
}

var getUserData = function () {
  // the score is the time left
  var timeLeftEl = document.getElementById("time-left");
  var scoreValue = parseInt(timeLeftEl.textContent);
  scoreObj = {
    value: scoreValue
    // ADD NAME
  }
  return scoreObj;
}

// handles the buttons contained in main
pageContentEl.addEventListener("click", mainButtonHandler);

countdownTimer();

