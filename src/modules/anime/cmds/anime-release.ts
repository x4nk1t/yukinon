import { Message, MessageEmbedOptions, MessageReaction, ReactionEmoji, User } from 'discord.js';
import CommandManager from '../../../CommandManager';
import { createReactionCollector } from '../../../Functions';
import Command from '../../../utils/Command';

class AnimeReleaseCommand extends Command {
    emojis: string[];
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: 'anime-release',
            description: "Shows animes about to release.",
            aliases: ['ar']
        })
        
        this.emojis = ['⏪', '◀️', '▶️' ,'⏩'];
    }
    
    async execute(message: Message, commandArgs: string[]){
        var lastPage = Math.floor((this.client.animeManager?.episodes.length || 10) / 10);
    
        var embed: MessageEmbedOptions = {
            color: 'BLUE',
            title: 'Airing Schedules',
            description: this.getPage(0),
            footer: {text: 'Requested by '+ message.author.username + ' • Page (1 / '+ (lastPage + 1) +')', icon_url: message.author.displayAvatarURL()}
        }
        
        const sent = await message.channel.send({embeds: [embed]})
        
        if(!this.client.animeManager?.episodes.length || lastPage == 1) return
        
        for(const emoji of this.emojis) sent.react(emoji)
        
        createReactionCollector(message, sent, lastPage, (page) => {
            embed.description = this.getPage(page);
            embed.footer = {text: 'Requested by '+ message.author.username + ' • Page ('+ (page + 1) +' / '+ (lastPage + 1) +')', icon_url: message.author.displayAvatarURL()}
            sent.edit({embeds: [embed]})
        })
    }
    
    getPage(page: number){
        var episodes = this.client.animeManager?.episodes;
        var content = '';
        var now = new Date().getTime()
        var start = page * 10;
        
        if(!episodes?.length){
            return 'No releases available.'
        }
        
        for(var i = start; i < (start + 10); i++){
            var anime = episodes[i];
            
            if(!episodes[i]) continue
            
            var diff = anime.airingAt - now;
            
            if(diff > 0){
                var title = anime.title;
                var episode = anime.episode;
                var url = anime.url;
                
                content += (i + 1) +'. ['+ this.shortText(title) +']('+ url +') (EP '+ episode +') - In '+ this.formatTime(diff) + '\n';
            }
        }
        
        return content
    }
    
    formatTime(time: number){
        time /= 1000;
        
        var days = Math.floor(time / 86400);
        var r = time % 86400;
        
        var hours = Math.floor(r / 3600);
        r %= 3600;
        
        var minutes = Math.floor(r / 60);
        r %= 60;
        
        return `${days}d ${hours}h ${minutes}m` 
    }
    
    shortText(text: string, length = 30) {
        if (text == null) {
            return "";
        }
        if (text.length <= length) {
            return text;
        }
        text = text.substring(0, length);
        var last = text.lastIndexOf(" ");
        text = text.substring(0, last);
        return text + "...";
    }
}

export default AnimeReleaseCommand
