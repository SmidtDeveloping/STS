const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const schema = require("../../../db/Punten").User
const client = require("../../../src/botClient")
module.exports = {
	catagory: "Punten",
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Leaderboard!'),
	async execute(interaction) {
		const guildid = interaction.guild.id
		const guild = client.guilds.cache.get(guildid)
		const leaderboard = await schema.find().limit(10).sort({punten: -1, woordenGeraden: -1})
		
		const users = []
		for (const user of leaderboard) {
			const user_fetch = await guild.members.fetch(user.userId)
			users.push({user, user_fetch})
		}

		const embed = new EmbedBuilder()
		.setColor("Random")
		.setTitle("Leaderboard")
		.setDescription("De 5 mensen met de meeste punten! Er word hier gekenen naar het totaal")

		
		users.slice(0, 5).forEach((userObj, index) => {
			const ind = index + 1; // Index plus één voor de PLEK
			embed.addFields(
				{ name: 'USER:', value: `<@${userObj.user_fetch.user.id}>`, inline: true },
				{ name: 'PLEK:', value: `${ind}`, inline: true },
				{ name: 'PUNTEN:', value: `${userObj.user.punten}`, inline: true },
				{ name: 'WOORDEN GERADEN:', value: `${ userObj.user.woordenGeraden}` , inline: true },
				{ name: 'TOTAAL:', value: `${userObj.user.punten + userObj.user.woordenGeraden}`, inline: true },
				{ name: 'ㅤㅤㅤㅤㅤ', value: `ㅤㅤㅤㅤㅤ`, inline: false }
			);	
		
	})		

	interaction.reply({embeds: [embed], ephemeral: true})


	},
};