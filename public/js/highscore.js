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
    const highScoreList = document.getElementById('highscore-list');
    highScoreList.innerHTML = '';

    highScores.forEach(score => {
        const li = document.createElement('li');
        li.innerText = `${score.username}: ${score.score}`;
        highScoreList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', fetchHighScores);

// Back to game button functionality
const backToGameBtn = document.getElementById('back-to-game-btn');
if (backToGameBtn) {
    // Back to game button functionality
    backToGameBtn.addEventListener('click', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    // Show an alert to confirm going back to the game
    const confirmBackToGame = confirm("Are you sure you want to go back to the game?");
    
    if (confirmBackToGame) {
        // If user confirms, go back to the game with the username
        window.location.href = `/game?username=${username}`;
    } else {
        // If user cancels, redirect to the game route without username
        window.location.href = '/home';
    }
});

}

// Clear scores button functionality
document.getElementById('clear-scores-btn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all high scores?')) {
        try {
            const response = await fetch('/clear-scores', {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('High scores cleared successfully!');
                fetchHighScores(); // Refresh the high scores after clearing
            } else {
                alert('Failed to clear high scores.');
            }
        } catch (err) {
            console.error('Error clearing high scores:', err);
        }
    }
});
