const EmbedBuilder = require('../utils/EmbedBuilder.js');
const Command = require('./Command.js');

class UptimeCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, "uptime", "Returns the uptime of the bot.");
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var date_future = new Date().getTime();
        var date_now = this.server.startTime;

        var delta = Math.abs(date_future - date_now) / 1000;

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        
        var seconds = Math.round(delta % 60);
        
        var embed = new EmbedBuilder().build()
            .setTitle('Uptime')
            .setDescription(days +'d '+ hours +'h '+ minutes + 'm '+ seconds + 's')
            .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
            .setTimestamp()
        
        message.channel.stopTyping()
        message.channel.send(embed);
    }
}

module.exports = UptimeCommand;