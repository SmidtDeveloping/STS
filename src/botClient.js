const { Client, GatewayIntentBits, ActivityType } = require("discord.js")
const client = new Client({
    intents:
        [
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.DirectMessages

        ],
        presence: {
            activities: [{
                type: ActivityType.Custom,
                name: "custom",
                state: "SJAKIE ON TOP!"
            }]
        }



})
require("dotenv").config()
client.login(process.env.TOKEN)

module.exports = client