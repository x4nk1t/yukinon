const Leaderboard = require("./cmds/leaderboard");
const Rank = require("./cmds/rank");
const Levels = require('./DiscordXp');
const Discord = require('discord.js')

class LevelingManager {
    constructor(client) {
        this.client = client;

        this.cmdManager = client.commandManager;
        this.lastMessage = new Discord.Collection()
        
        Levels.setURL(process.env.DB_URL)

        this.loadCommands()
        this.run()
    }

    loadCommands() {
        this.cmdManager.loadCommand(new Rank(this.cmdManager))
        this.cmdManager.loadCommand(new Leaderboard(this.cmdManager))
    }

    run() {
        this.client.on("message", async (message) => {
            if (!message.guild) return;
            if (message.author.bot) return;
            if (message.content.startsWith(this.cmdManager.prefix)) return;
            
            const lastMessage = this.lastMessage.get(message.author.id)
            
            if(lastMessage && (new Date().getTime() - (lastMessage.time)) < 2000) return

            const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
            const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
            
            this.lastMessage.set(message.author.id, {time: new Date().getTime()})

            if (hasLeveledUp) {
                
                const user = await Levels.fetch(message.author.id, message.guild.id);

                const levelEmbed = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('New Level!')
                    .setDescription(`**GG** ${message.author}, you just leveled up to level **${user.level}**! 🥳🥳`)

                const sendEmbed = await message.channel.send(levelEmbed)
            }
        });
    }
}

module.exports = LevelingManager