const router = require("express").Router()
const Loginschema = require("../../db/login");
const client = require("../../src/botClient")

router.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
		const guild = client.guilds.cache.get(req.session.guildid)
        const user = await Loginschema.findOne({username: req.session.user.username}).exec()
        const is2fa = user.tweefa
        res.render('dashboard/dashboard', {data: { req: req.session, guild: guild, check: is2fa}});
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
