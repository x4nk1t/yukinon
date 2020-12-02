const os = require('os')
const Command = require('./Command.js');

class Stats extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "stats",
            description: "Shows the status of the bot.",
            aliases: ['status']
        });
    }
    
    execute(message, commandArgs){
        var embed = {
            color: 'GREEN',
            fields: [
                { name: 'Ping', value: (new Date().getTime() - message.createdTimestamp) +'ms', inline: true },
                { name: 'Uptime', value: this.getUptime(), inline: true },
                { name: 'Memory Usage', value: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB', inline: true }
            ]
        }
        message.channel.send({embed: embed});
    }
    
    getUptime(){
        var date_in_ms = this.client.uptime;
        
        var delta = Math.abs(date_in_ms) / 1000;

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        
        var seconds = Math.round(delta % 60);
        
        return (days +'d '+ hours +'h '+ minutes + 'm '+ seconds + 's')
    }
}

module.exports = Stats
