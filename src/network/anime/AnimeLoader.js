const Discord = require('discord.js')
const axios = require('axios')
const cheerio = require('cheerio')

class AnimeLoader {
    constructor(client){
        this.client = client;
        
        this.checkInMinutes = 10;
        this.baseUrl = 'https://www19.gogoanime.io/';
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
            this.client.logger.info('Loaded released anime.')
            
            this.client.dbapi.getReleaseChannels((error2, data2) => {
                if(error2){
                    this.client.logger.error('Error occured while loading release channels: '+ data2.message)
                    return
                }
                this.release_channels = data2;
                this.client.logger.info('Loaded release channels.')
                
                this.checkTask()
                setInterval(() => this.run(), 1000 * 60 * this.checkInMinutes)
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
                    var url = img[i].children[1].attribs.href;
                    
                    details[j] = {};
                    details[j].imageUrl = imgUrl;
                    details[j].name = name;
                    details[j].episode = episodeNum.split(' ')[1];
                    details[j].url = this.baseUrl + url;
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
        const embed = new Discord.MessageEmbed()
        newEpisodes.forEach(async episode => {
            await this.client.dbapi.addAnimeRelease(episode.name, episode.episode, episode.url, (error, data) => {
                if(!error){
                    this.release_channels.forEach(channel => {
                        var id = channel.channel_id
                        var trackings = channel.tracking;
                        var tracking = trackings.split(',');
                       
                        tracking.forEach(track => {
                            if(this.filterName(track) == this.filterName(episode.name)){
                                const discord_channel = this.client.channels.cache.get(id)
                                
                                discord_channel.send({embed: {
                                    color: 'RANDOM',
                                    title: episode.name +' just got released.',
                                    thumbnail: {
                                        url: episode.imageUrl
                                    },
                                    fields: [
                                        {name: 'Name', value: episode.name, inline: true},
                                        {name: 'Episode', value: episode.episode, inline: true},
                                        {name: 'Link', value: episode.url}
                                    ]
                                }})
                            }
                        })
                    })
                } else {
                    this.client.logger.error('Error while posting anime: '+ data.message)
                }
            })
        })
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