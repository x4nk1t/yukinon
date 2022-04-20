import { Message } from 'discord.js';
import CommandManager from '../../../CommandManager';
import Command from '../../../utils/Command';
import Levels from '../DiscordXp';

class Rank extends Command{
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "rank",
            description: "Check your rank in this server",
            aliases: ['r']
        });
    }

    async execute(message: Message, commandArgs: string[]){
        if(!message.guild) return;

        const target = message.mentions.users.first() || message.author;

        const user = await Levels.fetch(target.id, message.guild.id);
        
        if (!user) return message.channel.send({embeds: [{color: 'BLUE', description: "Seems like this user has not earned any xp so far."}]});
        
        message.channel.send({embeds: [{color: 'BLUE', description: `**${target}** is currently **level ${user.level}** with **${user.xp} XP**.`}]});
    }
}

export default Rank;