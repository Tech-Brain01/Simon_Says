async function fetchHighScores() {
  try {
    const response = await fetch("/highscore");
    if (response.ok) {
      const highscores = await response.json();
      displayHighScores(highscores);
      console.log("Successfully fetched the high scores");
    } else {
      console.log("Failed to fetch the high scores");
    }
  } catch (err) {
    console.log("Error occurred while fetching the high scores", err);
  }
}

function displayHighScores(highScores) {
  const highScoreList = document.getElementById("highscore-list");
  highScoreList.innerHTML = "";

  highScores.forEach((score) => {
    const li = document.createElement("li");
    li.innerText = `${score.username}: ${score.score}`;
    highScoreList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", fetchHighScores);

const backToGameBtn = document.getElementById("back-to-game-btn");
if (backToGameBtn) {
  backToGameBtn.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");

    const confirmBackToGame = confirm(
      "Are you sure you want to go back to the game?"
    );

    if (confirmBackToGame) {
      window.location.href = `/game?username=${username}`;
    } else {
      window.location.href = "/home";
    }
  });
}

document
  .getElementById("clear-scores-btn")
  .addEventListener("click", async () => {
    if (confirm("Are you sure you want to clear all high scores?")) {
      try {
        const response = await fetch("/clear-scores", {
          method: "DELETE",
        });
        if (response.ok) {
          alert("High scores cleared successfully!");
          fetchHighScores();
        } else {
          alert("Failed to clear high scores.");
        }
      } catch (err) {
        console.error("Error clearing high scores:", err);
      }
    }
  });
