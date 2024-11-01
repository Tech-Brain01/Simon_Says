const mongoose = require("mongoose");

const HighScoreSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    score:{
        type: Number,
        required: true,
        min: 0,
    }
});

const Highscore = mongoose.model("Highscore",HighScoreSchema);

module.exports = Highscore;