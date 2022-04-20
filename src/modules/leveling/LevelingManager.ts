import { Collection, MessageOptions, Snowflake } from "discord.js";

import Client from "../../Client";
import CommandManager from "../../CommandManager";
import Leaderboard from "./cmds/leaderboard";
import Rank from "./cmds/rank";
import Levels from './DiscordXp';

class LevelingManager {
    client: Client;
    commandManager: CommandManager;
    lastMessage: Collection<Snowflake, {time: number}>;

    constructor(client: Client) {
        this.client = client;

        this.commandManager = client.commandManager;
        this.lastMessage = new Collection();
        
        //Levels.setURL(process.env.DB_URL!);

        this.loadCommands();
        this.run();
    }

    loadCommands() {
        this.commandManager.loadCommand(new Rank(this.commandManager))
        this.commandManager.loadCommand(new Leaderboard(this.commandManager))
    }

    run() {
        this.client.on("messageCreate", async (message) => {
            if (!message.guild) return;
            if (message.author.bot) return;
            if (message.content.startsWith(this.commandManager.prefix)) return;
            
            const lastMessage = this.lastMessage.get(message.author.id)
            
            if(lastMessage && (new Date().getTime() - (lastMessage.time)) < 2000) return

            const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
            const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
            
            this.lastMessage.set(message.author.id, {time: new Date().getTime()})

            if (hasLeveledUp) {
                
                const user = await Levels.fetch(message.author.id, message.guild.id);

                const levelEmbed: MessageOptions = {
                    embeds: [{
                        color: 'BLUE',
                        title: 'New Level!',
                        description: `**GG** ${message.author}, you just leveled up to level **${user.level}**! 🥳🥳`
                    }]
                }
                message.channel.send(levelEmbed)
            }
        });
    }
}

export default LevelingManager