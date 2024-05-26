const mongoose = require('mongoose');

const woordSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    woord: {
        type: String,
        required: true
    },
    reward: {
        type: Number,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    punten: {
        type: Number,
    },
    woordenGeraden: {
        type: Number,
    },
    laatsteWoord: {
        type: String
    }

});

const Punten = mongoose.model('Punten', woordSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Punten, User };
