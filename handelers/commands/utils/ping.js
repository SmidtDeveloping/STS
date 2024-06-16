const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")

module.exports = {
	catagory: "Utils",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute( interaction) {



		await interaction.deferReply()

		const laden = await interaction.editReply({content: "ladenn....."})

		const ws = interaction.client.ws.ping
		const Api = Date.now() - laden.createdTimestamp;

		let uptime = Math.floor(interaction.client.uptime / 86400000)


		const embed = new EmbedBuilder()
		.setThumbnail(interaction.client.user.displayAvatarURL({size: 1024}))
		.setColor("Blue")
		.setTimestamp()
		.setFooter({text: `Pinged at:`})
		.addFields(
			{
				name: 'Client:',
				value: `${ws}ms`,
			},
			{
				name: 'API',
				value: `${Api}Ms`
			},
			{
				name: "Uptime",
				value: `\ ${uptime} Dagen`
			}
		)

		await laden.edit({embeds: [embed], content: '', ephemeral: true})

		
	},
};