const Command = require('../../../utils/Command.js');
const Levels = require('../DiscordXp');

class Rank extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "rank",
            description: "Check your rank in this server",
            aliases: ['r'],
            guildOnly: true
        });
    }

    async execute(message, commandArgs){
        const manager = this.client.levelingManager;

        const target = message.mentions.users.first() || message.author;

        const user = await Levels.fetch(target.id, message.guild.id);
        
        if (!user) return message.channel.send({embeds: [{color: 'BLUE', description: "Seems like this user has not earned any xp so far."}]});
        
        message.channel.send({embeds: [{color: 'BLUE', description: `**${target}** is currently **level ${user.level}** with **${user.xp} XP**.`}]});
    }
}

module.exports = Rank