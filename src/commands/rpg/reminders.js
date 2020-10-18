const Command = require('../Command.js');

class RemindersCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "reminders",
            description: "Shows all rpg reminders",
            usage: "[user]",
            aliases: ['r'],
            enabled: false
        });
    }
    
    execute(message, commandArgs){
        const embed = {}
        const reminder = this.client.rpgReminder;
        var userId = message.author.id;
        var username = message.author.username;
        
        if(message.mentions[0]){
            var member = message.channel.guild.members.get(message.mentions[0].id)
            
            if(member) {
                userId = member.user.id;
                username = member.user.username;
            }
        }
        
        var lootbox = reminder.lootbox.get(userId);
        var hunt = reminder.hunt.get(userId);
        var adventure = reminder.adventure.get(userId);
        var training = reminder.training.get(userId);
        var progress = reminder.progress.get(userId);
        var miniboss = reminder.miniboss.get(userId);
        var horse = reminder.horse.get(userId);
        var arena = reminder.arena.get(userId);
        
        var description = '';

        if(hunt){
            description += "**Hunt:** "+ this.formatTime(hunt.time) +"\n";
        }
        if(lootbox){
            description += "**Lootbox:** "+ this.formatTime(lootbox.time) +"\n";
        }
        if(adventure){
            description += "**Adventure:** "+ this.formatTime(adventure.time) +"\n";
        }
        if(training){
            description += "**Training:** "+ this.formatTime(training.time) +"\n";
        }
        if(progress){
            description += "**Progress:** "+ this.formatTime(progress.time) +"\n";
        }
        if(miniboss){
            description += "**Miniboss:** "+ this.formatTime(miniboss.time) +"\n";
        }
        if(horse){
            description += "**Horse:** "+ this.formatTime(horse.time) +"\n";
        }
        if(arena){
            description += "**Arena:** "+ this.formatTime(arena.time) +"\n";
        }
        
        if(description == ''){
            description = "N/A";
        }
        
        embed.title = username +'\'s reminders'
        embed.color = this.client.embedColor
        embed.description = description
        embed.footer = {text: 'Requested by '+ message.author.username, icon_url: message.author.avatarURL}
        
        message.channel.createMessage({embed: embed})
    }
    
    formatTime(time_in_ms){
        var now = new Date().getTime()
        
        var time_in_ms = now - time_in_ms;
        
        var delta = Math.abs(time_in_ms) / 1000;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        
        var seconds = Math.round(delta % 60);
        
        return (hours +'h '+ minutes + 'm '+ seconds + 's')
    }
}

module.exports = RemindersCommand
