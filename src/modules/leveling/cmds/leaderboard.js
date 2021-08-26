const Command = require('../../../utils/Command.js');
const Levels = require('../DiscordXp');

class Leaderboard extends Command {
    constructor(commandLoader) {
        super(commandLoader, {
            name: "leaderboard",
            description: "Check leaderboard of this guild.",
            aliases: ['lb'],
            guildOnly: true
        });
    }

    async execute(message, commandArgs) {
        const manager = this.client.levelingManager;

        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);

        if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

        const leaderboard = await Levels.computeLeaderboard(this.client, rawLeaderboard, true);

        const lb = leaderboard.map(e => `${e.position}. <@${e.userID}> - **Level ${e.level}** - **XP: ${e.xp.toLocaleString()}**`); 

        message.channel.send({embed: {color: 'BLUE', description: `**Leaderboard**:\n\n${lb.join("\n\n")}`}});
    }
}

module.exports = Leaderboard