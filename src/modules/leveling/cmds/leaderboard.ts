import CommandManager from '../../../CommandManager';
import { Message } from 'discord.js';
import Command from '../../../utils/Command';
import Levels from '../DiscordXp';

class Leaderboard extends Command {
    constructor(commandManager: CommandManager) {
        super(commandManager, {
            name: "leaderboard",
            description: "Check leaderboard of this guild.",
            aliases: ['lb']
        });
    }

    async execute(message: Message, commandArgs: string[]) {
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild?.id, 10);

        if (rawLeaderboard.length < 1) return message.reply("Nobody's in leaderboard yet.");

        const leaderboard = await Levels.computeLeaderboard(this.client, rawLeaderboard, true);

        const lb = leaderboard.map(e => `${e.position}. <@${e.userID}> - **Level ${e.level}** - **XP: ${e.xp.toLocaleString()}**`); 

        message.channel.send({embeds: [{color: 'BLUE', description: `**${message.guild?.name}'s Leaderboard**:\n\n${lb.join("\n\n")}`}]});
    }
}

export default Leaderboard;