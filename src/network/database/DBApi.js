const Channels = require('./models/channel.js')
const Releases = require('./models/release.js')

class DBApi {
    constructor(client){
        this.client = client;
    }
    
    /*
    * Anime Release
    */
    
    addAnimeRelease(options, callback = () => {}){
        Releases.collection.insertMany(options, (err, docs) => {
            if(err){
                callback(true, {message: 'Something went wrong'})
                return
            }
            callback(false, {message: 'Successfully added to database.'})
        })
    }
    
    getAnimeRelease(callback){
        Releases.collection.find({}, async (err, releases) => {
            if(err){
                callback(true, {message: 'Failed to fetch from database.'})
                return;
            }
            const array = await releases.toArray()
            callback(false, array)
        })
    }
    
    /*
    * Tracking Anime
    */
    
    getTrackingAnime(channel, callback){
        callback(true, {message: 'Work in progress'})
    }
    
    addTrackingAnime(channel, anime_id, callback){
        callback(true, {message: 'Work in progress'})
    }
    
    removeTrackingAnime(channel, anime_id, callback){
        callback(true, {message: 'Work in progress'})
    }
    
    /*
    * Release channels
    */
    
    getReleaseChannels(callback){
        Channels.collection.find({}, async (err, channels) => {
            if(err){
                callback(true, {message: 'Failed to fetch from database.'})
                return;
            }
            const array = await channels.toArray()
            callback(false, array)
        })
    }
    
    addReleaseChannel(channel, callback){
        const id = channel.id;
        const releaseChannels = this.client.animeRelease.release_channels;
        var found = false;
        
        releaseChannels.forEach(rel => {
            if(rel.channel_id == id){
                found = true;
                callback(true, {message: 'Channel already exists'})
            }
        })
        
        if(found){
            return;
        }
        
        const chh = {
            channel_id: id, 
            tracking: ''
        };
        
        releaseChannels.push(chh)
        Channels.collection.insertOne(chh, (err, docs) => {
            if(err){
                callback(true, {message: 'Something went wrong'})
                return
            }
            callback(false, {message: 'Successfully added this channel to database.'})
        })
    }
    
    removeReleaseChannel(channel, callback){
        const id = channel.id;
        const releaseChannels = this.client.animeRelease.release_channels;
        var found = false;
        
        releaseChannels.forEach((rel, i) => {
            if(rel.channel_id == id){
                found = true
                Channels.collection.removeOne({channel_id: id}, (err, docs) => {
                    if(err){
                        callback(true, {message: 'Something went wrong'})
                        return
                    }
                    releaseChannels.splice(i, 1)
                    callback(false, {message: 'Successfully removed this channel from database.'})
                })
                return;
            }
        })
        if(found){
            return;
        }
        callback(true, {message: 'Channel not found'})
    }
}

module.exports = DBApi