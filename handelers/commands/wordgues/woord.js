const { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require("discord.js");
const client = require("../../../src/botClient");
const { EmbedBuilder } = require("@discordjs/builders");
const { User } = require("../../../db/Punten");
const db = require("../../../db/Punten").Punten
const sub_gues = new SlashCommandSubcommandBuilder()
.setName("gues")
.setDescription("Krijg een woord om te raden")

const sub_answer = new SlashCommandSubcommandBuilder()
.setName("answer")
.setDescription("Beantwoord je rencenste gues")
.addStringOption(option => 
    option.setName("antwoord")
    .setDescription("Het antwoord")
    .setRequired(true)
)
const sub_skip = new SlashCommandSubcommandBuilder()
.setName("skip")
.setDescription("Skip je rencenste gues")

const sub_groep = new SlashCommandSubcommandGroupBuilder()
.setName("gues_system")
.setDescription("Gues systeem")
.addSubcommand(sub_answer)
.addSubcommand(sub_gues)
.addSubcommand(sub_skip)

module.exports = {
    catagory: "Word Gues",
    data: new SlashCommandBuilder()
    .setName("woord")
    .setDescription("Command omtrent het word gues systeem")
    .addSubcommandGroup(sub_groep)
    ,
    async execute( interaction) {
        const subcommando = interaction.options.getSubcommand();
        const gebruikerId = interaction.user.id;
        const user = await User.findOne({userId: gebruikerId}).exec()
        async function createDB() {
            const newUser = new User({
                laatsteWoord: null,
                punten: 0,
                userId: gebruikerId,
                woordenGeraden: 0
            })
            newUser.save()
        }
        const GAME_MODES = ['Anagram', 'Letter Verlies'];

        function getRandomGameMode() {
            const randomIndex = Math.floor(Math.random() * GAME_MODES.length);
            return GAME_MODES[randomIndex];
        }
        
        // Functie om een woord te verliezen
        function loseLetter(word) {
            // Verlies een willekeurige letter uit het woord
            const randomIndex = Math.floor(Math.random() * word.length);
            const lostLetter = word[randomIndex];
            const updatedWord = word.substring(0, randomIndex) + '_' + word.substring(randomIndex + 1);
            return { updatedWord, lostLetter };
        }
        async function gues() {
            if (!user) {
                createDB().then((user) => {console.log(`Nieuw db acc aangemaakt: ${user}`)})
            }
            const count = await db.countDocuments();    
            const index = Math.floor(Math.random() * count);    
            const allDocuments = await db.collection.find({}).toArray();
            const word = allDocuments[index].woord            

            const gameMode = getRandomGameMode();
    
            let gameModeLogic;
            if (gameMode === 'Anagram') {
                gameModeLogic = word.split('').sort(() => Math.random() - 0.5).join('');
            } else if (gameMode === 'Letter Verlies') {
                const { updatedWord, lostLetter } = loseLetter(word);
                gameModeLogic = updatedWord;
            }
    
            const embed = new EmbedBuilder()
                .setTitle('Raad het Woord')
                .setDescription(`Het te raden woord is: **${gameModeLogic}**`)
                .addFields({ name: 'Acties', value: 'Reageer op dit bericht met /woord answer om het antwoord te geven of /woord skip om over te slaan. Je mag hier zo lang over doen als je wilt' }
                    , { name: "Gamemode", value: ` **${gameMode}**` }
                );
                user.laatsteWoord = word
                user.save()
            interaction.reply({ embeds: [embed], ephemeral: true });
            return word
        }
        if (subcommando === "gues") {
            try {
            gues()
            } catch (error) {
                console.error('Error occurred:', error);
            } 
        
        }
        
        
        if (subcommando === "answer") {
            const woord = interaction.options.getString('antwoord');
            const find_woord = await db.findOne({woord: woord}).exec()
            if (woord === user.laatsteWoord) {
                user.laatsteWoord = null
                user.punten = user.punten + find_woord.reward
                user.woordenGeraden = user.woordenGeraden + 1
                user.save()

                interaction.reply({content: `Je hebt het woord goed geraden. Je hebt ${find_woord.reward} Punten ontvangen je saldo zit nu op ${user.punten} `, ephemeral: true})
            } else {
                interaction.reply({content: "Fout.... helaas! Proberer het aub opnieuw met /woord gues_systeem answer", ephemeral: true})
            }
            

        }
        
        if (subcommando === "skip") {
            const laatstewoord = user.laatsteWoord
            if (!laatstewoord || laatstewoord === null) {
                interaction.reply({content: "Voer eerst /woord gues_systeem gues uit", ephemeral: true})
            } {
                gues();
            }
            

    }
}
}