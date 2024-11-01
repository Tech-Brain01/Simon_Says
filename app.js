const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Highscore = require('./models/highscore.js');
 
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
   .then(()=>{
    console.log("connection successful to db")
   })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/simon-says');
}

// HOME ROUTE
app.get("/home",(req,res)=>{
    res.render("welcome.ejs");
});

// GAME ROUTE
app.get("/game",(req,res)=>{
    let {username} = req.query;
    res.render("simon-says.ejs",{username});
});

// ROUTE TO GET THE SCORE
app.get('/highscore', async (req, res) => {
    try {
      const scores = await Highscore.find().sort({ score: -1 }).limit(10); // Get top 10 scores
      res.json(scores);  
    } catch (error) {
      res.status(500).send('Error fetching high scores');
    }
  });

// ROUTE TO SAVE OR UPDATE THE SCORE
app.post('/highscore', async (req, res) => {
    const { username, score } = req.body;

    try {
        // Find the user by username
        const existingScore = await Highscore.findOne({ username });

        if (existingScore) {
            // If user exists, update the score if the new score is higher
            if (score > existingScore.score) {
                existingScore.score = score;
                await existingScore.save();
                return res.status(200).send('High score updated!');
            } else {
                return res.status(200).send('Score not high enough to update.');
            }
        } else {
            // If user does not exist, create a new high score entry
            const newHighscore = new Highscore({ username, score });
            await newHighscore.save();
            return res.status(201).send('High score saved!');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving high score');
    }
});

// ROUTE TO RENDER THE HIGHSCORE PAGE
app.get('/highscorepage', async (req, res) => {
    const { username } = req.query;  // Extract username from query params
    try {
        const scores = await Highscore.find().sort({ score: -1 }).limit(10);
        res.render('highscore.ejs', { scores, username });  // Pass username to the view
    } catch (error) {
        res.status(500).send('Error fetching high scores');
    }
});


// ROUTE TO CLEAR ALL HIGH SCORES
app.delete('/clear-scores', async (req, res) => {
    try {
        await Highscore.deleteMany(); // Clear all scores
        res.status(200).send('All high scores cleared.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error clearing high scores');
    }
});


app.listen(3000,()=>{
    console.log("server is listing on port : 3000");
});