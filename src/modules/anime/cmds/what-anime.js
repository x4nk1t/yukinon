const Command = require('../../../utils/Command.js');
const AnimeInfo = require('../network/AnimeInfo.js');
const WhatAnimeGrabber = require('../network/WhatAnimeGrabber.js');

class WhatAnime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "what-anime",
            description: "Search for anime with screenshots.",
            usage: "[image link]",
            aliases: ['anime']
        });
        
        this.whatAnime = new WhatAnimeGrabber(this.client)
        this.animeInfo = new AnimeInfo(this.client)
    }
    
    execute(message, commandArgs){        
        var embed = {
            color: 'BLUE'
        }
        var image_link = '';
        
        if (message.attachments.size >= 1){
            image_link = message.attachments.first().url;
        } else if(commandArgs[0]){
            if(commandArgs[0].startsWith('http://') || commandArgs[0].startsWith('https://')) {
                image_link = commandArgs[0];
            } else {
                embed.description = 'URL not valid.';
                message.channel.send({embed: embed})
                return
            }
        } else {
            embed.description = 'You must atleast provide an attachment or a image url.';
            message.channel.send({embed: embed})
            return
        }
        
        this.whatAnime.getDetails(image_link, (error, json) => {
            if(error){
                embed.description = json.message
                
                message.channel.send({embed: embed})
                return
            }
            
            const mal_id = json.docs[0].mal_id;
            const anilist_id = json.docs[0].anilist_id;
            const title_english = json.docs[0].title_english || 'N/A';
            const title_romaji = json.docs[0].title_romaji || 'N/A';
            
            this.animeInfo.getDetails(mal_id, data => {
                if(data == null){
                    embed.title = title_romaji
                    embed.color = 'BLUE'
                    embed.url = 'https://myanimelist.net/anime/'+ mal_id
                    embed.thumbnail = {url: commandArgs[0]}
                    embed.fields = [
                        {name: 'English', value: title_english, inline: true},
                        {name: 'MAL', value: 'https://myanimelist.net/anime/'+ mal_id},
                        {name: 'AniList', value: 'https://anilist.co/anime/'+ anilist_id},
                        {name: '\u200b', value: '*Note: Could not load full data due to some error.*'}
                    ]
                    embed.footer = {text: 'Requested by '+ message.author.username, icon_url: message.author.displayAvatarURL()}
                    message.channel.send({embed: embed})
                    return
                }
                
                const imageUrl = data.image_url
                const title = data.title
                const type = data.type
                const source = data.source
                const episodes = data.episodes || 'N/A'
                const airing = data.airing ? 'Yes' : 'No'
                const score = data.score
                const aired = data.aired.string
                const mal_url = data.url
                
                embed.title = title
                embed.color = 'BLUE'
                embed.url = mal_url
                embed.thumbnail = {url: imageUrl}
                embed.fields = [
                    {name: 'English', value: title_english, inline: true},
                    {name: 'Score', value: score.toString(), inline: true},
                    {name: 'Type', value: type, inline: true},
                    {name: 'Source', value: source, inline: true},
                    {name: 'Episodes', value: episodes, inline: true},
                    {name: 'Airing', value: airing, inline: true},
                    {name: 'Aired', value: aired, inline: true},
                    {name: 'AniList', value: 'https://anilist.co/anime/'+ anilist_id},
                    {name: '\u200b', value: '*Note: Results might not be accurate.*'}
                ]
                embed.footer = {text: 'Requested by '+ message.author.username, icon_url: message.author.displayAvatarURL()}
                message.channel.send({embed: embed})
            })
        })
    }
}

module.exports = WhatAnime;
