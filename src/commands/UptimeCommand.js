const discord = require('discord.js');

class UptimeCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
    }
    
    onCommand(message, ...commandArgs){
        var date_future = new Date().getTime();
        var date_now = this.commandLoader.startTime;

        var delta = Math.abs(date_future - date_now) / 1000;

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        
        var seconds = Math.round(delta % 60);
        
        var embed = new discord.MessageEmbed()
            .setTitle('Uptime')
            .setColor(this.commandLoader.colorArray[Math.floor(Math.random() * this.commandLoader.colorArray.length)])
            .addField('Uptime', days +'d '+ hours +'h '+ minutes + 'm '+ seconds + 's')
            .setTimestamp()
        
        message.channel.send(embed);
    }
}

module.exports = UptimeCommand;