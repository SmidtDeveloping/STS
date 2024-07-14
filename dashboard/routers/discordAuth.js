const axios = require("axios");
const app = require("express").Router();

app.get("/discord", async  (req, res) => {
    const code = req.query.code
    const params = new URLSearchParams();
    params.append("client_id", process.env.LOGIN_CLIENT_ID);
    params.append("client_secret", process.env.LOGIN_CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);  
    params.append("redirect_uri", "https://sts.developingbyjulian.nl/discord");

    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', params);
        const { access_token, token_type } = response.data;
        const userDataResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `${token_type} ${access_token}`
            }
        });

        const user = {
            discordid: userDataResponse.data.id,
            name: userDataResponse.data.username,
            discord: true,
            acces_token: response.data.access_token
        };

        let guildid;
        if (userDataResponse.data.username === "julianrjc3") {
            guildid = "1233925574070767696";
        } else {
            guildid = "1230258666146365481";
        }
        req.session.user = user;
        req.session.guildid = guildid;
        return res.redirect("/servers");
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
})

function isLoggedIn(req, res, next) {
    console.log(req.session.user);
    if (req.session.user.access_token) {
      return true
    } {
        return false
    }
  }

  app.get("/servers", async (req, res) => {
    if (isLoggedIn === false) {
        return res.redirect('/');
    }
    console.log(req.session.user.acces_token);
    const userGuildResponse = await axios.get("https://discord.com/api/users/@me/guilds", {
        headers: {
            Authorization: `Bearer ${req.session.user.acces_token}`
        },
    })
    // console.log(userGuildResponse);
    const client = require("../../src/botClient")
    const guilds = await client.guilds.fetch()
    const userGuilds = userGuildResponse.data.filter(guild => {
        return (guild.permissions & 0x20) === 0x20 && guilds.has(guild.id);
    });
    // console.log(userGuilds);

      res.render('auth/servers', { guilds: userGuilds });

})

app.post('/servers', (req, res) => {
    const guildId = req.body.guildId;
    req.session.guildid = guildId;
    res.redirect('/dashboard');
});
module.exports = app;
