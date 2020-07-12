const Discord = require('discord.js');
const fetch = require('node-fetch')

class DBApi {
    constructor(client){
        this.client = client;
        this.baseUrl = 'http://4nk1t.gq/api';
        
        this.animeReleaseUrl = this.baseUrl + '/anime_release.php';
        this.trackingAnimeUrl = this.baseUrl + '/tracking_animes.php';
        this.releaseChannelUrl = this.baseUrl + '/release_channels.php';
    }
    
    /*
    * Anime Release
    */
    
    addAnimeRelease(name, episode, link, anime_id){
        const obj = {
            name: name,
            episode: episode,
            link: link,
            anime_id: anime_id
        }
        
        fetch(this.animeReleaseUrl +'?add', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch(error => {
            this.client.logger.error('Something went wrong: '+ error)
        })
    }
    
    getAnimeRelease(){
        fetch(this.animeReleaseUrl)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                this.client.logger.error('Something went wrong: '+ error)
            })
    }
    
    /*
    * Tracking Anime
    */
    
    getTrackingAnime(channel){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.trackingAnimeUrl +'?channel_id='+ channel.id)
            .then(response => response.json())
            .then(data => {
                embed.setDescription(data.message)
                channel.send(embed)
            })
            .catch(error => {
                embed.setDescription('Something went wrong. Try again later.')
                channel.send(embed)
            })
    }
    
    addTrackingAnime(channel, anime_id){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.trackingAnimeUrl +'?channel_id='+ channel.id +'&add='+ anime_id)
            .then(response => response.json())
            .then(data => {
                embed.setDescription(data.message)
                channel.send(embed)
            })
            .catch(error => {
                embed.setDescription('Something went wrong. Try again later.')
                channel.send(embed)
            })
    }
    
    removeTrackingAnime(channel, anime_id){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.trackingAnimeUrl +'?channel_id='+ channel.id +'&remove='+ anime_id)
            .then(response => response.json())
            .then(data => {
                embed.setDescription(data.message)
                channel.send(embed)
            })
            .catch(error => {
                embed.setDescription('Something went wrong. Try again later.')
                channel.send(embed)
            })
    }
    
    /*
    * Release channels
    */
    
    getReleaseChannels(){
        fetch(this.releaseChannelUrl)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                this.client.logger.error('Something went wrong: '+ error)
            })
    }
    
    addReleaseChannel(channel){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.releaseChannelUrl +'?add='+ channel.id)
            .then(response => response.json())
            .then(data => {
                embed.setDescription(data.message)
                channel.send(embed)
            })
            .catch(error => {
                embed.setDescription('Something went wrong. Try again later.')
                channel.send(embed)
            })
    }
    
    removeReleaseChannel(channel){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.releaseChannelUrl +'?remove='+ channel.id)
            .then(response => response.json())
            .then(data => {
                embed.setDescription(data.message)
                channel.send(embed)
            })
            .catch(error => {
                embed.setDescription('Something went wrong. Try again later.')
                channel.send(embed)
            })
    }
}
module.exports = DBApi