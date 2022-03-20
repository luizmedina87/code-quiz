// question objects to use. Should change to json file afterwards
questions = [
  question1 = {
    question: "What hoisting means?",
    options: [
      "Declarations are restricted to the imediate scope", 
      "Declarations are moved to the top", 
      "Declarations are interpreted linearly",
      "Declarations are hosted on the html"
    ],
    indexCorrect: 1
  },
  question2 = {
    question: "Which one is NOT a valid JS type?",
    options: [
      "Boolean", 
      "Null", 
      "Undefined", 
      "Series", 
      "Number", 
      "Bigint"
    ],
    indexCorrect: 3
  },
  question3 = {
    question: "What is the difference between '==' and '==='?",
    options: [
      "The first compares values, whereas the last compares both values and types", 
      "The first compares values and types, whereas the last compares only values", 
      "'===' is not a valid operator", 
      "'==' is not a valid operator"
    ],
    indexCorrect: 3
  },
  question4 = {
    question: "What does the following code return? \n var x = 3; \n var y = '3'; \n x + y",
    options: [
      "6",
      "'33'", 
      "Error",
    ],
    indexCorrect: 1
  },
  question5 = {
    question: "How to declare a new variable 'i' to hold a number in JS?",
    options: [
      "variable i;", 
      "i;", 
      "Number i;",
      "int i;" ,
      "number i;",
      "var i;"

  ],
    indexCorrect: 5
  }
];

var pageContentEl = document.getElementById("page-content");
var headerEl = document.getElementById("main-header");
var buttonsListUlEl = document.getElementById("buttons-list");
var currentQuestion = 0;
var continueTimer = false;
var totalTime = 60;

var makeMainPage = function() {
  var headerEl = document.getElementById("main-header");
  var mainEl = document.getElementById("page-content");
  // Setting class for main
  mainEl.className = "main-structure main-landing";
  // clearing content
  headerEl.innerHTML = "";
  mainEl.innerHTML = "";
  // creating viewscores
  var viewScoresEl = document.createElement("h1");
  viewScoresEl.textContent = "View Highscores";
  viewScoresEl.setAttribute("id", "view-scores");
  headerEl.appendChild(viewScoresEl);
  // creating timer
  var timerEl = document.createElement("div");
  timerEl.setAttribute("id", "timer-div");
  timerEl.innerHTML = "<p>Time: <span id='time-left'></span></p>";
  headerEl.appendChild(timerEl);
  // editing h2
  var quizTitleEl = document.createElement("h2");
  quizTitleEl.setAttribute("id", "quiz-title");
  quizTitleEl.className = "welcome-title";
  quizTitleEl.textContent = "Coding Quiz Challenge";
  mainEl.appendChild(quizTitleEl);
  // paragraph
  var quizInstEl = document.createElement("p");
  quizInstEl.setAttribute("id", "quiz-instructions");
  quizInstEl.innerHTML = `
  Try to answer the following code-related questions within the time limit.
  <br> Keep in mind that incorrect answers will penalize your score/time by ten
  seconds!
  `;
  mainEl.appendChild(quizInstEl);
  // start button
  var buttonsListUlEl = document.createElement("ul");
  var startBtnEl = document.createElement("li");
  buttonsListUlEl.setAttribute("id", "buttons-list");
  startBtnEl.className = "start-btn-li";
  startBtnEl.innerHTML = "<button id='start-btn' class='btn'>Start Quiz</button>";
  buttonsListUlEl.appendChild(startBtnEl);
  mainEl.appendChild(buttonsListUlEl);
}


var decreaseTimer = function(seconds) {
  var timeLeftEl = document.getElementById("time-left");
  var timeLeft = parseInt(timeLeftEl.textContent);
  timeLeft = Math.max(0, timeLeft - seconds);
  timeLeftEl.textContent = timeLeft;
}

var countdownTimer = function() {
  // getting time left
  var updateTime = function () {
    // continue going if there is time left and the test is not over
    if (continueTimer) {
      var timeLeftEl = document.getElementById("time-left");
      var timeLeft = parseInt(timeLeftEl.textContent);
      if (timeLeft > 0) {
        // updating time left
        decreaseTimer(1);
      }
      else {
        window.alert("Time is over!");
        continueTimer = false;
        showHighscores();
      }
    }
  }
  setInterval(updateTime, 1000);
};

var mainButtonHandler = function(event) {
  event.preventDefault();
  var targetEl = event.target;
  // things only happen if the user clicks a button
  if (targetEl.nodeName == "BUTTON") {
    // if the user clicks the start button, it should start the game
    if (targetEl.matches("#start-btn")) {
      // debugger;
      // making sure it starts at the first question
      currentQuestion = 0;
      startQuiz();
    }
    // if the user clicks submit, it should save the score
    else if (targetEl.matches("#submit-btn")) {
      // get data from user
      var highScore = getUserData();
      if (validateInitials(highScore)) {
        submitScore(highScore);
        showHighscores();
      }
    }
    else if (targetEl.matches("#go-back-btn")) {
      makeMainPage();
    }
    // clear the scores set out by the user
    else if (targetEl.matches("#clear-scores-btn")) {
      var confirmClear = window.confirm("Are you sure you want to delete the scores?");
      if (confirmClear) {
        var scoresListEl = document.getElementById("scores-list");
        localStorage.removeItem("scores");
        scoresListEl.textContent = "";
      }
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

var initialsFormHandler = function(event) {
  event.preventDefault();
  // get data from user
  var highScore = getUserData();
  if (validateInitials(highScore)) {
    submitScore(highScore);
    showHighscores();
  }
}

var startQuiz = function() {
  // classes should change to change css formatting
  var mainEl = document.getElementById("page-content");
  mainEl.className = "main-structure main-questions";
  var quizTitleEl = document.getElementById("quiz-title");
  quizTitleEl.className = "question-title";
  // <p> should disappear because questions don't need it
  var quizInstEl = document.getElementById("quiz-instructions");
  quizInstEl.remove();
  // delete start quiz button
  var quizBtnEl = document.getElementById("start-btn");
  quizBtnEl.parentElement.remove();
  // start timer
  timerEl = document.getElementById("time-left");
  timerEl.textContent = totalTime;
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
    listEl.className = "question-btn-li";
    // create <button>
    var btnEl = document.createElement("button");
    btnEl.className = "question-btn btn";
    btnEl.setAttribute("id", i);
    btnEl.textContent = (i + 1) + ". " + optionTxt;
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
  // if element exists, it will remove it
  if (answerCorrectnessEl) {
    answerCorrectnessEl.remove();
  }
  // and now recreate it, to recreate animation
  var answerCorrectnessEl = document.createElement("p");
  answerCorrectnessEl.id = "answer-correctness";
  mainEl.appendChild(answerCorrectnessEl);
  answerCorrectnessEl.textContent = informText;
};

var endQuiz = function() {
  // stop timer
  continueTimer = false;
  // geting page content
  var pageContentEl = document.getElementById("page-content");
  // changing css style
  pageContentEl.className = "main-structure main-all-done"
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
  finalScoreEl.textContent = "Your score is " + timeLeft + ".";
  finalScoreEl.setAttribute("id", "final-score-text")
  pageContentEl.appendChild(finalScoreEl);
  // debugger;
  // creating div to hold form and button
  var divEl = document.createElement("div");
  divEl.className = "submit-section";
  pageContentEl.appendChild(divEl);
  // creating initials form
  var enterInitialsEl = document.createElement("form");
  enterInitialsEl.setAttribute("id", "initials-form");
  enterInitialsEl.innerHTML = `
    <label for='initials'>Enter initials:</label>
    <input type='text' id='initials' name='initials' class='form-input'/>
  `;
  divEl.appendChild(enterInitialsEl);
  // creating submit button
  var submitButtonEl = document.createElement("button");
  submitButtonEl.setAttribute("id", "submit-btn");
  submitButtonEl.className = "btn"
  submitButtonEl.textContent = "Submit";
  divEl.appendChild(submitButtonEl);
  // placing correctness message as last element
  var answerCorrectnessEl = document.getElementById("answer-correctness");
  pageContentEl.appendChild(answerCorrectnessEl);
}

var submitScore = function (highScore) {
  // try to get saved scores from local storage
  var savedScores = localStorage.getItem("scores");
  savedScores = JSON.parse(savedScores);
  // if there aren't any, create a list with scores, otherwise append
  if (!savedScores) {
    savedScores = [highScore];
  }
  else {
    savedScores = insertSorted(savedScores, highScore);
  }
  // save score
  localStorage.setItem("scores", JSON.stringify(savedScores))
}

var getUserData = function() {
  var inputInitialsEl = document.getElementById("initials");
  userInitials = inputInitialsEl.value;
  // the score is the time left
  var timeLeftEl = document.getElementById("time-left");
  var scoreValue = parseInt(timeLeftEl.textContent);
  scoreObj = {
    initials: userInitials,
    value: scoreValue
  }
  return scoreObj;
}

var validateInitials = function(userObject) {
  initials = userObject.initials;
  if (!initials) {
    window.alert("Please enter your initials");
    return false;
  }
  else{
    return true;
  }
}

var insertSorted = function(array, object) {
  var userScore = object.value;
  for (var i = 0; i < array.length; i++) {
    var auxScore = array[i].value;
    if (userScore >= auxScore) {
      break;
    }
  }
  array.splice(i, 0, object);
  return array;
}

var showHighscores = function() {
  // stop timer
  continueTimer = false;
  // deleting content, recreating h2
  var mainEl = document.getElementById("page-content");
  var headerEl = document.getElementById("main-header");
  var quizTitleEl = document.createElement("h2");
  mainEl.innerHTML = "";
  headerEl.innerHTML = "";
  quizTitleEl.setAttribute("id", "quiz-title");
  quizTitleEl.className = "welcome-title";
  quizTitleEl.textContent = "High scores";
  mainEl.appendChild(quizTitleEl);
  // correcting styles css
  mainEl.className = "main-structure main-hs"
  // show high scores
  var scoresListEl = document.createElement("ol");
  scoresListEl.setAttribute("id", "scores-list");
  var savedScores = localStorage.getItem("scores");
  if (savedScores) {
    savedScores = JSON.parse(savedScores);
    for (let i = 0; i < savedScores.length; i++) {
      scoresListEl.appendChild(makeScoreItem(savedScores[i], i+1));
    }
  }
  else {
    console.log("no scores")
  }
  mainEl.appendChild(scoresListEl);
  // make div to hold buttons
  var divEl = document.createElement("div");
  divEl.className = "buttons-div";
  mainEl.appendChild(divEl);
  // make go back button
  var goBackBtnEl = document.createElement("button");
  goBackBtnEl.className = "hs-btn btn";
  goBackBtnEl.setAttribute("id", "go-back-btn");
  goBackBtnEl.textContent = "Go back";
  divEl.appendChild(goBackBtnEl);
  // make clear scores button
  var clearScoresBtn = document.createElement("button");
  clearScoresBtn.className = "hs-btn btn";
  clearScoresBtn.setAttribute("id", "clear-scores-btn");
  clearScoresBtn.textContent = "Clear high scores";
  divEl.appendChild(clearScoresBtn);
}

var makeScoreItem = function(scoreObj, rank) {
  var scoreListItemEl = document.createElement("li");
  scoreListItemEl.textContent = rank + ". " + scoreObj.initials.toUpperCase() + " - " + scoreObj.value;
  scoreListItemEl.className = "score-list-item";
  return scoreListItemEl;
}

var viewScoresHandler = function(event) {
  var targetEl = event.target;
  if (targetEl.matches("#view-scores")) {
    showHighscores();
  }
}

// creates the main page elements
makeMainPage()

// creates the timer
countdownTimer();

// handles the buttons contained in main
pageContentEl.addEventListener("click", mainButtonHandler);

// handles the input form at the end of the test
pageContentEl.addEventListener("submit", initialsFormHandler);

// handles the view highscores option
headerEl.addEventListener("click", viewScoresHandler);