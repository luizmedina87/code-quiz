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
}

countdownTimer();

// question objects to use. Should change to json file afterwards
questions = [
  question1 = {
    question: "What option is 3?",
    options: ["1", "2", "3"],
    index_correct: 3
  },
  question2 = {
    question: "what option is 4?",
    options: ["1", "2", "3", "4"],
    index_correct: 4
  }
];