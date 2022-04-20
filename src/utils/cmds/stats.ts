import { Message, MessageOptions } from "discord.js";
import CommandManager from "../../CommandManager";

import Command from '../Command';

class Stats extends Command{
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "stats",
            description: "Shows the status of the bot.",
            aliases: ['status']
        });
    }
    
    async execute(message: Message, commandArgs: string[]){
        var sent = await message.channel.send('Pong!!');
        
        var used = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        var total = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);

        var embed: MessageOptions = {content: '\n', embeds: [{
            color: 'BLUE',
            fields: [
                { name: 'Ping', value: (sent.createdTimestamp - message.createdTimestamp) +'ms', inline: true },
                { name: 'Uptime', value: this.getUptime(), inline: true },
                { name: 'Memory usage', value: used +'MB /'+ total + ' MB'}
            ]
        }]};
        
        sent.edit(embed);
    }
    
    getUptime(){
        var date_in_ms = this.client.uptime!;
        
        var delta = Math.abs(date_in_ms) / 1000;

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        
        var seconds = Math.round(delta % 60);
        
        return (days +'d '+ hours +'h '+ minutes + 'm '+ seconds + 's');
    }
}

export default Stats;
