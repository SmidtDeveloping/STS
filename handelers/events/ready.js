const { Events, ActivityType } = require('discord.js');
const mongoose = require("mongoose")
const client = require("../../src/botClient")
const fs = require("fs")
require("dotenv").config()
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(cloent) {
		console.log(`✅| ${client.user.username} (Client)`)
		console.log(`${client.guilds.cache.size} | Guilds`);
		client.guilds.cache.forEach((index, guild) => {
			console.log(`${guild} | ${index.name}`);
		})
		mongoose.connect(process.env.DATABASE)
			.then(
				console.log("✅| Database")
			)
			const activities = [
				{ name: 'STS!!', type: ActivityType.Listening },
				{ name: 'GEMAAKT DOOR JULIANRJC', type: ActivityType.Listening },
				{name: "WEBSITE", type: ActivityType.Streaming, url: "https://developingbyjulian.nl"}
			];
		// client.user.setActivity('MONSTERGANG!!', { type: ActivityType.Listening })

		function setRandomActivity() {
			const randomActivity = activities[Math.floor(Math.random() * activities.length)];
			if (randomActivity.type === ActivityType.Listening) {
				client.user.setActivity(randomActivity.name, { type: randomActivity.type });
			} else if (randomActivity.type === ActivityType.Streaming) {
				client.user.setActivity({name: randomActivity.name, type: randomActivity.type, url: randomActivity.url});
			}
		}
		client.user.setPresence({activites: [{name: 'STS '}], status: "online"})

		// Stel de activiteit in wanneer de bot voor het eerst online komt
		setRandomActivity();
	
		// Wijzig de activiteit elke 30 minuten
		setInterval(setRandomActivity, 1 * 60 * 1000); // 1 minuut in milliseconden
	},
};
