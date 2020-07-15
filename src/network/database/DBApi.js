const Discord = require('discord.js');
const axios = require('axios')

class DBApi {
    constructor(client){
        this.client = client;
        this.baseUrl = 'http://4nk1t.gq/api';
        
        this.animeReleaseUrl = this.baseUrl + '/anime_release.php';
        this.trackingAnimeUrl = this.baseUrl + '/tracking_animes.php';
        this.releaseChannelUrl = this.baseUrl + '/release_channels.php';
        
        this.cooldown = 1;
    }
    
    /*
    * Anime Release
    */
    
    addAnimeRelease(name, episode, link, anime_id, callback = () => {}){
        setInterval(() => {this.cooldown--}, 1000)
        while(this.cooldown != 0){
            //do nothing
        }
        this.cooldown = 1;
        const obj = {
            name: name,
            episode: episode,
            link: link,
            anime_id: anime_id
        }
        const buff = Buffer.from(JSON.stringify(obj))
        const base64 = buff.toString('base64')
        
        axios({
            method: 'post',
            url: this.animeReleaseUrl +'?add&json='+ base64,
            data: obj
        })
            .then(response => {
                console.log(response.data)
                callback(false, response.data)
            })
            .catch(error => {
                this.client.logger.error('Something went wrong: '+ error)
                callback(true, {message: 'Something went wrong. Try again later'})
            })
    }
    
    getAnimeRelease(callback){
        axios.get(this.animeReleaseUrl)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                this.client.logger.error(error)
                callback(true, {message: 'Something went wrong. Try again later'})
            })
    }
    
    /*
    * Tracking Anime
    */
    
    getTrackingAnime(channel, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        axios.get(this.trackingAnimeUrl +'?channel_id='+ channel.id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                this.client.logger.error('Something went wrong: '+ error)
                callback(true, {message: 'Something went wrong. Try again later'})
            })
    }
    
    addTrackingAnime(channel, anime_id, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        axios.get(this.trackingAnimeUrl +'?channel_id='+ channel.id +'&add='+ anime_id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                this.client.logger.error('Something went wrong: '+ error)
                callback(true, {message: 'Something went wrong. Try again later'})
            })
    }
    
    removeTrackingAnime(channel, anime_id, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        axios.get(this.trackingAnimeUrl +'?channel_id='+ channel.id +'&remove='+ anime_id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: 'Something went wrong. Try again later'})
            })
    }
    
    /*
    * Release channels
    */
    
    getReleaseChannels(callback){
        axios.get(this.releaseChannelUrl)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: 'Something went wrong. Try again later'})
            })
    }
    
    addReleaseChannel(channel, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        axios.get(this.releaseChannelUrl +'?add='+ channel.id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: 'Something went wrong. Try again later'})
            })
    }
    
    removeReleaseChannel(channel, callback){
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            
        axios.get(this.releaseChannelUrl +'?remove='+ channel.id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: 'Something went wrong. Try again later'})
            })
    }
}
module.exports = DBApi