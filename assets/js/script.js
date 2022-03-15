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

var pageContentEl = document.getElementById("page-content")
var currentQuestion = 0;

var countdownTimer = function() {
  // getting time left
  var timeLeftEl = document.getElementById("time-left");
  var timeLeft = parseInt(timeLeftEl.textContent);
  const timer = setInterval(updateTime, 1000);
  function updateTime() {
    if (timeLeft > 0) {
      // updating time left
      timeLeft -= 1;
      timeLeftEl.textContent = timeLeft;
    }
    else {
      clearInterval(timer)
    }
  }
};

var mainButtonHandler = function(event) {
  var targetEl = event.target;
  // if the user clicks the start button, it should start the game
  if (targetEl.matches("#start-btn")) {
    startQuiz();
  }
  // if it is an option button, check if it is the last question
  else if (currentQuestion < (questions.length - 1)) {
    console.log("cq " + currentQuestion + "  ql " + questions.length);
    var chosenAnswer = parseInt(targetEl.id);
    var rightAnswer = questions[currentQuestion].indexCorrect;
    if (chosenAnswer === rightAnswer) {
      informUser("Right");
    }
    else {
      // DECREASE TIMER BY 10 SECONDS
      informUser("Wrong");
    }
    document.getElementById("buttons-list").textContent = "";
    currentQuestion++;
    showQuestion();
  }
  else {
    // MAKE ENDQUIZ FUNCTION
    console.log("No more questions")
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

// handles the buttons contained in main
pageContentEl.addEventListener("click", mainButtonHandler);

countdownTimer();

