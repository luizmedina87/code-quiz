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

var makeMainPage = function() {
  var headerEl = document.getElementById("main-header");
  var mainEl = document.getElementById("page-content");
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
  timerEl.innerHTML = "<p>Time: <span id='time-left'>60</span></p>";
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
  quizInstEl.textContent = `
  Try to answer the following code-related questions within the time limit.
  Keep in mind that incorrect answers will penalize your score/time by ten
  seconds!
  `;
  mainEl.appendChild(quizInstEl);
  // start button
  var buttonsListUlEl = document.createElement("ul");
  var startBtnEl = document.createElement("li");
  buttonsListUlEl.setAttribute("id", "buttons-list");
  startBtnEl.className = "btn";
  startBtnEl.innerHTML = "<button id='start-btn'>Start Quiz</button>";
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
  var targetEl = event.target;
  // things only happen if the user clicks a button
  if (targetEl.nodeName == "BUTTON") {
    // if the user clicks the start button, it should start the game
    if (targetEl.matches("#start-btn")) {
      // making sure it starts at the first question
      currentQuestion = 0;
      startQuiz();
    }
    // if the user clicks submit, it should save the score
    else if (targetEl.matches("#submit-btn")) {
      submitScore();
      showHighscores();
    }
    else if (targetEl.matches("#go-back-btn")) {
      makeMainPage();
    }
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
  finalScoreEl.setAttribute("id", "final-score-text")
  pageContentEl.appendChild(finalScoreEl);
  // creating initials form
  var enterInitialsEl = document.createElement("form");
  enterInitialsEl.setAttribute("id", "initials-form");
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
  // SORT ITEMS BEFORE SAVING
}

var getUserData = function () {
  var inputInitialsEl = document.getElementById("initials");
  userInitials = inputInitialsEl.value;
  // TEST IF USER ENTERED INITIALS
  // the score is the time left
  var timeLeftEl = document.getElementById("time-left");
  var scoreValue = parseInt(timeLeftEl.textContent);
  scoreObj = {
    initials: userInitials,
    value: scoreValue
  }
  return scoreObj;
}

var showHighscores = function () {
  // changing title
  // var quizTitleEl = document.getElementById("quiz-title");
  // quizTitleEl.textContent = "High scores";
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

  // show high scores
  var scoresListEl = document.createElement("ol");
  scoresListEl.setAttribute("id", "scores-list");
  var savedScores = localStorage.getItem("scores");
  if (savedScores) {
    savedScores = JSON.parse(savedScores);
    for (let i = 0; i < savedScores.length; i++) {
      scoresListEl.appendChild(makeScoreItem(savedScores[i]));
    }
  }
  else {
    console.log("no scores")
  }
  mainEl.appendChild(scoresListEl);
  // make go back button
  var goBackBtnEl = document.createElement("button");
  goBackBtnEl.className = "btn";
  goBackBtnEl.setAttribute("id", "go-back-btn");
  goBackBtnEl.textContent = "Go back";
  mainEl.appendChild(goBackBtnEl);
  // make clear scores button
  var clearScoresBtn = document.createElement("button");
  clearScoresBtn.className = "btn";
  clearScoresBtn.setAttribute("id", "clear-scores-btn");
  clearScoresBtn.textContent = "Clear high scores";
  mainEl.appendChild(clearScoresBtn);
}

var makeScoreItem = function(scoreObj) {
  var scoreListItemEl = document.createElement("li");
  scoreListItemEl.textContent = scoreObj.initials + " - " + scoreObj.value;
  scoreListItemEl.className = "score-list-item";
  return scoreListItemEl;
}

// creates the main page elements
makeMainPage()

// handles the buttons contained in main
pageContentEl.addEventListener("click", mainButtonHandler);

// starts the timer
countdownTimer();

