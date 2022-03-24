const AnimeReleaseCMD = require('./cmds/anime-release.js')
const WhatAnime = require('./cmds/what-anime.js')
const AnimeChannel = require('./cmds/anime-channel.js')
const TrackAnime = require('./cmds/anime-track.js')

const Channels = require('./models/channels.js')
const fetch = require('node-fetch')

class AnimeManager {
    constructor(client){
        this.client = client;
        
        this.apiUrl = 'https://graphql.anilist.co';
        this.episodes = [];
        this.animeChannels = [];
        
        this.cmdManager = client.commandManager;
        
        this.loadCommands()
        this.run()
    }
    
    async run(){
        await this.getAnimeChannels().then(data => { this.animeChannels = data; }).catch(console.log)
        await this.getNewReleases().then(data => { this.episodes = data; }).catch(console.log)
        
        if(this.episodes.length) {
            this.setTimeouts()
        } else {
            setTimeout(() => this.run(), 300000) //5min
        }
    }
    
    loadCommands(){
        this.cmdManager.loadCommand(new AnimeReleaseCMD(this.cmdManager))
        this.cmdManager.loadCommand(new WhatAnime(this.cmdManager))
        this.cmdManager.loadCommand(new AnimeChannel(this.cmdManager))
        this.cmdManager.loadCommand(new TrackAnime(this.cmdManager))
    }
    
    setTimeouts(){
        this.episodes.forEach(episode => {
            var now = new Date().getTime()
            var id = episode.id;
            var title = episode.title;
            var url = episode.url;
            var episode_num = episode.episode;
            var cover = episode.cover;
            var airingAt = episode.airingAt;
            var difference = airingAt - now;
            
            if(difference > 0){
                setTimeout(() => {
                    var embed = {
                        title: 'New episode got released!',
                        color: 'BLUE',
                        thumbnail: {url: cover},
                        fields: [
                            {name: 'Title', value: title, inline: true},
                            {name: 'Episode', value: episode_num, inline: true},
                            {name: 'AniList', value: url}
                        ],
                        timestamp: new Date(),
                    }
                    
                    this.animeChannels.forEach(ch => {
                        var channel = this.client.channels.cache.get(ch.channel_id)
                        var trackings = ch.tracking
                        
                        if(trackings.length){
                            trackings.forEach(tr => {
                                if(tr == id){
                                    channel.send({embeds: [embed]})
                                }
                            })
                        } else {
                            channel.send({embeds: [embed]})
                        }
                    })
                    
                    this.episodes.splice(this.episodes.indexOf(episode), 1)
                }, difference)
            }
        })
    }
    
    /*
    * Database API
    */
    
    getAnimeChannels(){
        return new Promise((resolve, reject) => {
            Channels.collection.find({}, async (err, channels) => {
                if(err){
                    reject(err)
                    return
                }
                
                const ch = await channels.toArray()
                resolve(ch)
            })
        })
    }
    
    addAnimeChannel(channel_id){
        return new Promise((resolve, reject) => {
            Channels.collection.findOneAndUpdate({channel_id: channel_id, tracking: []}, {$set: {last_updated: new Date().getTime()}}, {upsert: true}, err => {
                if(err){
                    this.client.logger.error(err)
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }
    
    removeAnimeChannel(channel_id){
        return new Promise((resolve, reject) => {
            Channels.collection.findOneAndDelete({channel_id: channel_id}, (err, channels) => {
                if(err){
                    this.client.logger.error(err)
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }
    
    updateTracking(channel_id, tracking){
        return new Promise((resolve, reject) => {
            Channels.collection.findOneAndUpdate({channel_id: channel_id}, {$set: { tracking: tracking, last_updated: new Date().getTime()}},(err, channels) => {
                if(err){
                    this.client.logger.error(err)
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }
    
    /*
    * Anilist API
    */
    
    getAnimeFromIDArray(idArray){
        return new Promise((resolve, reject) => {
            var query = `query($idArray: [Int]){Page{media(id_in: $idArray){title {userPreferred},id,idMal,countryOfOrigin}}}`;
            var variables = {idArray: idArray}
            var options = this.optionBuilder({query: query, variables: variables})
            this.sendRequest(options, (err, data) => {
                if(err){
                    reject(data)
                    return
                }
                const media = data.data.Page.media
                resolve(media)
            })
        })
    }
    
    getNewReleases(){
        return new Promise((resolve, reject) => {
            var query = `{Page{airingSchedules(notYetAired: true){media{id,title {userPreferred}, coverImage{large}, countryOfOrigin, siteUrl},episode,airingAt}}}`;
            var options = this.optionBuilder({query: query})
            this.sendRequest(options, (err, data) => {
                if(err){
                    reject(data)
                    return
                }
                const {airingSchedules} = data.data.Page;
                var array = []
                
                for(var i = 0; i < airingSchedules.length; i++){
                    const schedule = airingSchedules[i];
                    const media = schedule.media;
                    const id = media.id;
                    const title = media.title.userPreferred;
                    const url = media.siteUrl;
                    const cover = media.coverImage.large;
                    const countryOfOrigin = media.countryOfOrigin;
                    const episode = schedule.episode;
                    const airingAt = schedule.airingAt;
                    
                    if(countryOfOrigin == "JP"){
                        array.push({
                            id: id,
                            title: title,
                            episode: episode,
                            url: url,
                            cover: cover,
                            airingAt: (airingAt * 1000)
                        })
                    }
                }
                resolve(array)
            })
        })
    }
    
    sendRequest(options, callback = () => {}){
        fetch(this.apiUrl, options).then(response => response.json()).then(data => {
            callback(false, data)
        }).catch(err => {
            console.log(err)
            callback(true, err)
        })
    }
    
    optionBuilder(object){
        var options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(object)
        }
        
        return options;
    }
}

module.exports = AnimeManager
