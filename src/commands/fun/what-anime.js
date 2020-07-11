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
            embed.setDescription(`**Usage:** ${this.usage}`)
            message.channel.send(embed)
            return
        }
        
        this.whatAnime.getDetails(commandArgs[0], json => {
            if(json == null){
                embed.setDescription('Something went wrong while processing. Might have been rate limit.')
                
                message.channel.send(embed)
                message.channel.stopTyping()
                return
            }
            
            const mal_id = json.docs[0].mal_id;
            
            this.animeInfo.getDetails(mal_id, data => {
                if(data == null){
                    embed.setDescription('Something went wrong while grabbing anime detail.')
                
                    message.channel.send(embed)
                    message.channel.stopTyping()
                    return
                }
                
                const imageUrl = data.image_url
                const title = data.title
                const title_english = data.title_english ? data.title_english : 'N/A'
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