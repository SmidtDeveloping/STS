const router = require("express").Router()
const Loginschema = require("../../db/login");
const client = require("../../src/botClient")
const WordSchema = require("../../db/Punten").Punten
router.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
		const guild = client.guilds.cache.get(req.session.guildid)
        
        var isWoord = false
        const count = await WordSchema.countDocuments()
        if (count > 0) {
            isWoord = true
        } else {
            isWoord = false
        }
        res.render('dashboard/dashboard', {data: { req: req.session, guild: guild, woord: isWoord}});
    }
});


router.get("/", (req, res) => {
    res.render("dashboard/index")
    })

router.get("/error", (req, res) => {
    const error = req.query.error ? req.query.error.replace(/-/g, " ") : "";
    res.render("dashboard/error", {data: {text: error}})
})

    module.exports = router
