import Command from '../../../utils/Command';
import Discord, { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import CommandManager from '../../../CommandManager';
import { TimerInterface } from '../TacoManager';

class TacoRemindersCommand extends Command{
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "taco-reminders",
            description: "Shows all taco reminders",
            usage: "[user]",
            aliases: ['tr']
        });
    }
    
    execute(message: Message, commandArgs: string[]){
        const embed: MessageEmbedOptions = {}
        const tacoManager = this.client.tacoManager;
        var userId = message.author.id;
        var username = message.author.username;
        
        if(message.mentions.users.first()){
            var member = message.guild!.members.cache.get(message.mentions.users.first()!.id);
            
            if(member) {
                userId = member.user.id;
                username = member.user.username;
            }
        }
        
        var description = '';
        var timerStorage = tacoManager.timerStorage;

        var timers = timerStorage.get(userId);

        if(timers){
            var locationMap = new Discord.Collection<string, TimerInterface[]>();
            for(let [key, value] of timers){
                var location = tacoManager.getLocationOfThis(key).toLowerCase();

                if(location == '') {
                    var locMap = locationMap.get('blank');
                    if(!locMap) locationMap.set('blank', []);
                    value.boost = key;
                    locationMap.get('blank')!.push(value)
                } else {
                    var locMap = locationMap.get('notblank');
                    if(!locMap) locationMap.set('notblank', []);
                    value.boost = key;
                    locationMap.get('notblank')!.push(value)
                }
            }
            var locations = ['blank', 'notblank'];
            var isFirst = true;

            locations.forEach(loc => {
                if(loc == "notblank" && isFirst) {
                    description += '\n';
                    isFirst = false;
                }

                var details = locationMap.get(loc);

                if(!details) return;

                details.forEach((detail: TimerInterface) => {
                    var boost = detail.boost;
                    var time = detail.time;

                    description += "**"+ tacoManager.capitalizeFirstLetter(boost!) +":** " + this.formatTime(time) + "\n";
                })
            })
        } else {
            description = "There are no reminders!";
        }
        
        embed.title = username +'\'s taco reminders'
        embed.color = 'BLUE'
        embed.description = description
        embed.footer = {text: 'Requested by '+ message.author.username, icon_url: message.author.displayAvatarURL()}
        
        message.channel.send({embeds: [embed]})
    }
    
    formatTime(time_in_ms: number){
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

export default TacoRemindersCommand