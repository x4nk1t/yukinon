const Discord = require('discord.js')
const axios = require('axios')
const cheerio = require('cheerio')

class AnimeLoader {
    constructor(client){
        this.client = client;
        
        this.checkInMinutes = 5;
        this.baseUrl = 'https://www.gogoanime.so';
        this.episodes = [];
        this.release_channels = [];
    }
    
    run(){
        this.client.dbapi.getAnimeRelease((error, data) => {
            if(error){
                this.client.logger.error('Error occured while loading anime released: '+ data.message)
                return;
            }
            this.episodes = data;
            
            this.client.dbapi.getReleaseChannels((error2, data2) => {
                if(error2){
                    this.client.logger.error('Error occured while loading release channels: '+ data2.message)
                    return
                }
                this.release_channels = data2;
                
                this.checkTask()
                setInterval(() => this.checkTask(), 1000 * 60 * this.checkInMinutes)
            })
        })
    }
    
    checkTask(){
        axios.get(this.baseUrl)
            .then(response => {
                const data = response.data
                const $ = cheerio.load(data)
                
                var img = $('.last_episodes .items li .img')
                var episode = $('.last_episodes .items li .episode')
                var details = [];
                var j = 0;
                
                for(var i = (img.length - 1); i >= 0; i--){
                    var imgUrl = img[i].children[1].children[1].attribs.src;
                    var name = img[i].children[1].children[1].attribs.alt;
                    var episodeNum = episode[i].children[0].data;
                    var link = img[i].children[1].attribs.href;
                    
                    details[j] = {};
                    details[j].imageUrl = imgUrl;
                    details[j].name = name;
                    details[j].episode = episodeNum.split(' ')[1];
                    details[j].link = this.baseUrl + link;
                    
                    j++;
                }
                this.sendReleases(details)
            })
            .catch(error => {
                this.client.logger.error(error)
            })
    }
    
    sendReleases(details){
        const newEpisodes = this.checkNewEpisodes(details)
        
        if(newEpisodes.length){
            newEpisodes.forEach(episode => {
                this.episodes.push(episode)
                
                var embed = new Discord.MessageEmbed()
                    .setTitle('New episode just got released.')
                    .setThumbnail(episode.imageUrl)
                    .addFields(
                        {name: 'Name', value: episode.name, inline: true},
                        {name: 'Episode', value: episode.episode, inline: true},
                        {name: 'Link', value: episode.link}
                    )
                    .setTimestamp()
                
                this.release_channels.forEach(channel => {
                    var id = channel.channel_id
                    var trackings = channel.tracking;
                    var tracking = trackings.split('|');
                    var discord_channel = this.client.channels.cache.get(id)
                    
                    if(trackings == ''){
                        if(discord_channel != undefined){
                            embed.setColor('RANDOM')
                            discord_channel.send(embed)
                        }
                    } else {
                        tracking.forEach(track => {
                            if(this.filterName(track) == this.filterName(episode.name)){
                                if(discord_channel != undefined){
                                    embed.setColor('RANDOM')
                                    discord_channel.send(embed)
                                }
                            }
                        })
                    }
                })
            })
            
            this.client.dbapi.addAnimeRelease(this.buildObj(newEpisodes), (error, data) => {
                if(!error){
                    this.client.logger.info(data.message)
                } else {
                    this.client.logger.error('Error while posting anime: '+ data.message)
                }
            })
        }
    }
    
    buildObj(episodes){
        var array = [];
        episodes.forEach(episode => {
            var obj = {};
            obj.name = episode.name;
            obj.episode = episode.episode;
            
            array.push(obj)
        })
        
        return array
    }
    
    filterName(string){
        return string.toLowerCase().replace(' ', '').replace('\t', '')
    }
    
    checkNewEpisodes(details){
        var newEpisodes = [...details]
        for(var i = this.episodes.length - 1; i >= 0; i--){
            for(var j = 0; j < newEpisodes.length; j++){
                if(this.episodes[i].name == newEpisodes[j].name && this.episodes[i].episode == newEpisodes[j].episode){
                    newEpisodes.splice(j, 1)
                }
            }
        }
        
        return newEpisodes
    }
}

module.exports = AnimeLoader
