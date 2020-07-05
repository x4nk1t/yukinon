const Command = require('../Command.js');

class Uptime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "uptime",
            description: "Returns the uptime of the bot."
        });
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var date_in_ms = this.client.uptime;
        
        var delta = Math.abs(date_in_ms) / 1000;

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        
        var seconds = Math.round(delta % 60);
        
        var embed = {
            title: 'Uptime',
            color: 'RANDOM',
            description: days +'d '+ hours +'h '+ minutes + 'm '+ seconds + 's',
            footer: {
                text: 'Requested by '+ message.author.username,
                icon_url: message.author.displayAvatarURL()
            }
        }
        
        message.channel.send({embed: embed});
        message.channel.stopTyping()
    }
}

module.exports = Uptime;