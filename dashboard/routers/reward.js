const router = require("express").Router();
const WordSchema = require("../../db/Punten").Punten;
const client = require("../../src/botClient");

// Load pagina
router.get('/dashboard/create-reward', async (req, res) => {
    const guildid = req.session.guildid;
    const words = await WordSchema.find({ guildId: guildid });

    const guild = client.guilds.cache.get(guildid);
    const guildWords = words.map(word => ({
        name: word.woord,
        points: word.reward
    }));

    res.render("setups/createReward", { data: { words: guildWords, session: req.session } });
});

// Post req bij invullen form
router.post('/dashboard/create-reward', async (req, res) => {
    const guildid = req.session.guildid;
    const { word, points } = req.body;

    const wordExists = await WordSchema.findOne({ guildId: guildid, word: word });

    if (wordExists) {
        res.redirect("/error?error=Word-bestaat-al");
    } else {
        const newWord = new WordSchema({
            guildId: guildid,
            woord: word,
            reward: points
        });

        newWord.save().then(() => {
            res.redirect(`/dashboard`);
        }).catch(error => {
            console.error("Error saving new word:", error);
            res.redirect("/error?error=Internal-server-error");
        });
    }
});

module.exports = router;
