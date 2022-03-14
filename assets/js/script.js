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
