const Command = require('../../../utils/Command.js');

class TacoRemindersCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "taco-reminders",
            description: "Shows all taco reminders",
            usage: "[user]",
            aliases: ['tr']
        });
    }
    
    execute(message, commandArgs){
        const embed = {}
        const reminder = this.client.tacoManager;
        var userId = message.author.id;
        var username = message.author.username;
        
        if(message.mentions.users.first()){
            var member = message.guild.member(message.mentions.users.first())
            
            if(member) {
                userId = member.user.id;
                username = member.user.username;
            }
        }
        
        var tips = reminder.tips.get(userId);
        var work = reminder.work.get(userId);
        var overtime = reminder.overtime.get(userId);
        var clean = reminder.clean.get(userId);
        var daily = reminder.daily.get(userId);
        var vote = reminder.vote.get(userId);

        var flipper = reminder.flipper.get(userId);
        var karaoke = reminder.karaoke.get(userId);
        var music = reminder.music.get(userId);
        var airplane = reminder.airplane.get(userId);
        var chef = reminder.chef.get(userId);
        
        var description = '';
        
        if(tips){
            description += "**Tips:** "+ this.formatTime(tips.time) +"\n";
        }
        if(work){
            description += "**Work:** "+ this.formatTime(work.time) +"\n";
        }
        if(overtime){
            description += "**Overtime:** "+ this.formatTime(overtime.time) +"\n";
        }
        if(clean){
            description += "**Clean:** "+ this.formatTime(clean.time) +"\n";
        }
        if(daily){
            description += "**Daily:** "+ this.formatTime(daily.time) +"\n";
        }
        if(vote){
            description += "**Vote:** "+ this.formatTime(vote.time) +"\n";
        }

        description += '\n';

        if(flipper){
            description += "**Flipper:** "+ this.formatTime(flipper.time) +"\n";
        }

        if(karaoke){
            description += "**Karaoke:** "+ this.formatTime(karaoke.time) +"\n";
        }

        if(music){
            description += "**Music:** "+ this.formatTime(music.time) +"\n";
        }

        if(airplane){
            description += "**Airplane:** "+ this.formatTime(airplane.time) +"\n";
        }

        if(chef){
            description += "**Chef:** "+ this.formatTime(chef.time) +"\n";
        }
        
        if(description == ''){
            description = "N/A";
        }
        
        embed.title = username +'\'s taco reminders'
        embed.color = 'BLUE'
        embed.description = description
        embed.footer = {text: 'Requested by '+ message.author.username, icon_url: message.author.displayAvatarURL()}
        
        message.channel.send({embed: embed})
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

module.exports = TacoRemindersCommand