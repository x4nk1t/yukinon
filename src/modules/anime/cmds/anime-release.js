const Command = require('../../../utils/Command.js');

class AnimeReleaseCommand extends Command {
    constructor(commandLoader){
        super(commandLoader, {
            name: 'anime-release',
            description: "Shows animes about to release.",
            aliases: ['ar']
        })
        
        this.emojis = ['⏪', '◀️', '▶️' ,'⏩'];
    }
    
    async execute(message, commandArgs){
        var lastPage = Math.floor(this.client.animeManager.episodes.length / 10);
    
        var embed = {
            color: 'BLUE',
            title: 'Airing Schedules',
            description: this.getPage(0),
            footer: {text: 'Requested by '+ message.author.username + ' • Page (1 / '+ (lastPage + 1) +')', icon_url: message.author.displayAvatarURL()}
        }
        
        const sent = await message.channel.send({embeds: [embed]})
        
        if(!this.client.animeManager.episodes.length || lastPage == 1) return
        
        for(const emoji of this.emojis) sent.react(emoji)
        
        const reactionCollector = sent.createReactionCollector((reaction, user) => this.emojis.includes(reaction.emoji.name) && !user.bot, {time: 120000})
        
        var page = 0;
        
        reactionCollector.on('collect', reaction => {
            reaction.users.remove(message.author)
            
            switch(reaction.emoji.name){
                case this.emojis[0]:
                    page = 0;
                break;
                case this.emojis[1]:
                    page = page == 0 ? 0 : page - 1;
                    break;
                case this.emojis[2]:
                    page = page == lastPage ? lastPage : page + 1;
                    break;
                case this.emojis[3]:
                    page = lastPage;
                break;
            }
            embed.description = this.getPage(page);
            embed.footer = {text: 'Requested by '+ message.author.username + ' • Page ('+ (page + 1) +' / '+ (lastPage + 1) +')', icon_url: message.author.displayAvatarURL()}
            sent.edit({embeds: [embed]})
        })
    }
    
    getPage(page){
        var episodes = this.client.animeManager.episodes;
        var content = '';
        var now = new Date().getTime()
        var start = page * 10;
        
        if(!episodes.length){
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
    
    formatTime(time){
        time /= 1000;
        
        var days = Math.floor(time / 86400);
        var r = time % 86400;
        
        var hours = Math.floor(r / 3600);
        r %= 3600;
        
        var minutes = Math.floor(r / 60);
        r %= 60;
        
        return `${days}d ${hours}h ${minutes}m` 
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
