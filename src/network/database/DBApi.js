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
        .then(response => response.json())
        .then(data => {
            callback(false, data)
        })
        .catch(error => {
            this.client.logger.error('Something went wrong: '+ error)
            callback(true, {message: 'Something went wrong.'})
        })
    }
    
    getAnimeRelease(callback){
        fetch(this.animeReleaseUrl)
            .then(response => response.json())
            .then(data => {
                callback(false, data)
            })
            .catch(error => {
                callback(true, {message: 'Something went wrong.'})
            })
    }
    
    /*
    * Tracking Anime
    */
    
    getTrackingAnime(channel, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.trackingAnimeUrl +'?channel_id='+ channel.id)
            .then(response => response.json())
            .then(data => {
                callback(false, data)
            })
            .catch(error => {
                this.client.logger.error('Something went wrong: '+ error)
                callback(true, {message: 'Something went wrong.'})
            })
    }
    
    addTrackingAnime(channel, anime_id, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.trackingAnimeUrl +'?channel_id='+ channel.id +'&add='+ anime_id)
            .then(response => response.json())
            .then(data => {
                callback(false, data)
            })
            .catch(error => {
                this.client.logger.error('Something went wrong: '+ error)
                callback(true, {message: 'Something went wrong.'})
            })
    }
    
    removeTrackingAnime(channel, anime_id, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.trackingAnimeUrl +'?channel_id='+ channel.id +'&remove='+ anime_id)
            .then(response => response.json())
            .then(data => {
                callback(false, data)
            })
            .catch(error => {
                callback(true, {message: 'Something went wrong.'})
            })
    }
    
    /*
    * Release channels
    */
    
    getReleaseChannels(callback){
        fetch(this.releaseChannelUrl)
            .then(response => response.json())
            .then(data => {
                callback(false, data)
            })
            .catch(error => {
                callback(true, {message: 'Something went wrong.'})
            })
    }
    
    addReleaseChannel(channel, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.releaseChannelUrl +'?add='+ channel.id)
            .then(response => response.json())
            .then(data => {
                callback(false, data)
            })
            .catch(error => {
                callback(true, {message: 'Something went wrong.'})
            })
    }
    
    removeReleaseChannel(channel, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        fetch(this.releaseChannelUrl +'?remove='+ channel.id)
            .then(response => response.json())
            .then(data => {
                callback(false, data)
            })
            .catch(error => {
                callback(true, {message: 'Something went wrong.'})
            })
    }
}
module.exports = DBApi