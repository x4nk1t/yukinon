const Command = require('../Command.js');

class AnimeReleaseCommand extends Command {
    constructor(commandLoader){
        super(commandLoader, {
            name: 'anime-release',
            description: "Shows animes about to release.",
            aliases: ['ar']
        })
    }
    
    execute(message, commandArgs){
        var count = 0;
        var now = new Date().getTime()
        var description = ''
        
        this.client.animeRelease.episodes.some(anime => {
            var diff = anime.airingAt - now;
            
            if(diff > 0){
                var id = anime.id;
                var title = anime.title;
                var episode = anime.episode;
                var url = anime.url;
                var cover = anime.cover;
                var airingAt = anime.airingAt;
            
                description += (count + 1) +'. ['+ this.shortText(title) +']('+ url +') (EP '+ episode +')\n-In '+ this.formatTime(diff) + '\n';
                count++
                
                if(count == 10) return true
            }
        })
        
        var embed = {
            description: description,
            footer: {text: 'Requested by '+ message.author.username, icon_url: message.author.displayAvatarURL()}
        }
        
        message.channel.send({embed: embed})
    }
    
    formatTime(time){
        time /= 1000;
        
        var days = Math.floor(time / 86400);
        var r = time % 86400;
        
        var hours = Math.floor(r / 3600);
        r %= 3600;
        
        var minutes = Math.floor(r / 60);
        r %= 60;
        
        var seconds = Math.floor(r);
        
        return `${days}d ${hours}h ${minutes}m ${seconds}s` 
    }
    
    shortText(text, length = 30) {
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

module.exports = AnimeReleaseCommand
