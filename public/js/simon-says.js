let gameseq = [];
let userseq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;

let h2 = document.querySelector("h2");

// start the game

document.addEventListener("keypress", function () {
  if (started == false) {
    console.log("game started");
    started = true;
    levelup();
  }
});

// flash button & level up

function gameflash(btn) {
  btn.classList.add("flash");
  setTimeout(function () {
    btn.classList.remove("flash");
  }, 250);
}

function levelup() {
  userseq = []; // empty the user seq
  level++;
  h2.innerText = `Level : ${level}`;

  let randIdx = Math.floor(Math.random() * 4);
  let randcolor = btns[randIdx];
  let randBtn = document.querySelector(`.${randcolor}`);
  gameseq.push(randcolor);
  gameflash(randBtn);
}

// Button event listener

function userflash(btn) {
  btn.classList.add("userflash");
  setTimeout(function () {
    btn.classList.remove("userflash");
  }, 250);
}

function btnpress() {
  let btn = this;
  userflash(btn);

  let usercolor = btn.getAttribute("id");
  userseq.push(usercolor);

  checkAns(userseq.length - 1);
}

let allbtns = document.querySelectorAll(".btn");
for (allbtn of allbtns) {
  allbtn.addEventListener("click", btnpress);
}

// MATCHING SEQUENCE

function checkAns(idx) {
  if (userseq[idx] == gameseq[idx]) {
    if (userseq.length == gameseq.length) {
      setTimeout(levelup(), 1000); //delay the level up time
    }
  } else {
    h2.innerHTML = `Game Over!! Your score was <b>${level}</b> <br> Press any key to start again.`;
    document.querySelector("body").style.backgroundColor = "red";
    setTimeout(function () {
      document.querySelector("body").style.backgroundColor = "white";
    }, 150);
    saveHighScore(level);
    reset();
  }
}

// Reset the game

function reset() {
  started = false;
  gameseq = [];
  userseq = [];
  level = 0;
  h2.innerText = `Press any key to start`;
  document.querySelector("body").style.backgroundColor = "white";
}

//SAVE THE HIGHSCORE FEATURE

async function saveHighScore(level) {
  const urlParmas = new URLSearchParams(window.location.search);
  const username = urlParmas.get("username");

  if (username && level > 0) {
    try {
      const respone = await fetch("/highscore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, score: level }),
      });
      if (response.ok) {
        console.log("High Score Submitted Successfully");
      } else {
        console.log("failed to submit the High Score");
      }
    } catch (err) {
      console.log("Error submitting high score:", err);
    }
  }
}

//Exit , HIGHSCORE and RESET Button

let exitBtn = document.getElementById("exit");
let resetBtn = document.getElementById("reset");
let highscorebtn = document.getElementById("highscore");

exitBtn.addEventListener("click", () => {
  if (confirm(`Are you sure to exit the game`)) {
    window.location.href = "/home";
  }
});

resetBtn.addEventListener("click", () => {
  if (confirm(`Are you sure to reset the game`)) {
    reset();
  }
});

// Assuming `username` is available in the scope where this code is running

highscorebtn.addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search); // Get the current URL parameters
  const username = urlParams.get('username'); // Extract the username from the URL

  if (confirm(`Are you sure you want to leave the game?`)) {
    // Redirect to the high score page with the username as a query parameter
    window.location.href = `/highscorepage?username=${username}`;
  }
});

