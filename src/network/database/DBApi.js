const axios = require('axios')

class DBApi {
    constructor(client){
        this.client = client;
        
        this.animeReleaseUrl = 'https://4nk1t.gq/api/v1/anime_release.php';
        this.trackingAnimeUrl = 'https://4nk1t.gq/api/v1/tracking_animes.php';
        this.releaseChannelUrl = 'https://4nk1t.gq/api/v1/release_channels.php';
    }
    
    /*
    * Anime Release
    * Add option to add multiple entries at once
    */
    
    addAnimeRelease(name, episode, link, callback = () => {}){
        const obj = {
            name: name,
            episode: episode,
            link: link
        }
        const buff = Buffer.from(JSON.stringify(obj))
        const base64 = buff.toString('base64')
        
        axios.get(this.animeReleaseUrl +'?add&json='+ base64)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: error})
            })
    }
    
    getAnimeRelease(callback){
        axios.get(this.animeReleaseUrl)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: error})
            })
    }
    
    /*
    * Tracking Anime
    */
    
    getTrackingAnime(channel, callback){            
        axios.get(this.trackingAnimeUrl +'?channel_id='+ channel.id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: error})
            })
    }
    
    addTrackingAnime(channel, anime_id, callback){            
        axios.get(this.trackingAnimeUrl +'?channel_id='+ channel.id +'&add='+ anime_id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: error})
            })
    }
    
    removeTrackingAnime(channel, anime_id, callback){
        axios.get(this.trackingAnimeUrl +'?channel_id='+ channel.id +'&remove='+ anime_id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: error})
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
                callback(true, {message: error})
            })
    }
    
    addReleaseChannel(channel, callback){
        axios.get(this.releaseChannelUrl +'?add='+ channel.id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: error})
            })
    }
    
    removeReleaseChannel(channel, callback){
        axios.get(this.releaseChannelUrl +'?remove='+ channel.id)
            .then(response => {
                callback(false, response.data)
            })
            .catch(error => {
                callback(true, {message: error})
            })
    }
}
module.exports = DBApi