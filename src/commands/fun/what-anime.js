const Discord = require('discord.js')
const Command = require('../Command.js');
const AnimeInfo = require('../../network/anime/AnimeInfo.js');
const WhatAnimeGrabber = require('../../network/anime/WhatAnimeGrabber.js');

class WhatAnime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "what-anime",
            description: "Reverse search for anime with screenshots.",
            usage: "<link>",
            aliases: ['anime']
        });
        
        this.whatAnime = new WhatAnimeGrabber(this.client)
        this.animeInfo = new AnimeInfo(this.client)
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setColor('#FF0000')
            
        if(!commandArgs[0]){
            this.sendUsage(message)
            return
        }
        
        this.whatAnime.getDetails(commandArgs[0], (error, json) => {
            if(error){
                embed.setDescription(json.message)
                
                message.channel.send(embed)
                message.channel.stopTyping()
                return
            }
            
            const mal_id = json.docs[0].mal_id;
            const title_english = json.docs[0].title_english || 'N/A';
            const title_romaji = json.docs[0].title_romaji || 'N/A';
            
            this.animeInfo.getDetails(mal_id, data => {
                if(data == null){
                    embed.setTitle(title_romaji)
                        .setColor('RANDOM')
                        .setThumbnail(commandArgs[0])
                        .addField('English', title_english, true)
                        .addField('MAL Link', 'https://myanimelist.net/anime/'+ mal_id)
                        .addField('\u200b', '*Note: Full data could not be loaded due to some error.*')
                
                    message.channel.send(embed)
                    message.channel.stopTyping()
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
                
                embed.setTitle(title)
                    .setColor('RANDOM')
                    .setThumbnail(imageUrl)
                    .addField('English', title_english, true)
                    .addField('Score', score, true)
                    .addField('Type', type, true)
                    .addField('Source', source, true)
                    .addField('Episodes', episodes, true)
                    .addField('Airing', airing, true)
                    .addField('Aired', aired, true)
                    .addField('MAL Link', mal_url, true)
                    .addField('\u200b', '*Note: This might not be accurate.*')
                
                message.channel.send(embed)
                message.channel.stopTyping()
            })
        })
    }
}

module.exports = WhatAnime;