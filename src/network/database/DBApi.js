const Channels = require('./models/channel.js')
const Releases = require('./models/release.js')

class DBApi {
    constructor(client){
        this.client = client;
    }
    
    /*
    * Tracking Anime
    */
    
    addTrackingAnime(channel, name, callback){
        var channels = this.client.animeRelease.release_channels;
        var found = false;
        var alreadyAdded = false;
        
        channels.forEach(chh => {
            if(chh.channel_id == channel.id){
                var split = chh.tracking.split('|')
                found = true
                
                split.forEach((s, i) => {
                    if(s == '') split.splice(i, 1)
                    if(this.filterName(s) == this.filterName(name)){
                        alreadyAdded = true
                        callback(true, {message: 'This anime is already in tracking list.'})
                        return;
                    }
                })
                if(!alreadyAdded){
                    split.push(name)
                    chh.tracking = split.join('|') + '|';
                    Channels.collection.updateOne({channel_id: channel.id}, { $set: {tracking: chh.tracking}}, (err, docs) => {
                        if(err){
                            callback(true, {message: 'Failed to update the tracking list.'})
                            return
                        }
                        callback(false, {message: 'Successfully added to tracking list'})
                    })
                }
            }
        })
        if(!found) callback(true, {message: 'This channel is not an anime release channel.'})
    }
    
    removeTrackingAnime(channel, name, callback){
        var channels = this.client.animeRelease.release_channels;
        var channelFound = false;
        var animeFound = false;
        
        channels.forEach(chh => {
            if(chh.channel_id == channel.id){
                var split = chh.tracking.split('|')
                channelFound = true
                
                split.forEach((s, i) => {
                    if(s == '') split.splice(i, 1)
                    if(this.filterName(s) == this.filterName(name)){
                        animeFound = true;
                        split.splice(i, 1)
                    }
                })
                
                if(animeFound){
                    chh.tracking = split.join('|') +'|';
                    Channels.collection.updateOne({channel_id: channel.id}, { $set: {tracking: chh.tracking}}, (err, docs) => {
                        if(err){
                            callback(true, {message: 'Failed to update the tracking list.'})
                            return
                        }
                        callback(false, {message: 'Successfully removed from tracking list'})
                    })
                } else {
                    callback(true, {message: 'That anime was not found on this channel\'s list.'})
                }
            }
        })
        if(!channelFound) callback(true, {message: 'This channel is not an anime release channel.'})
    }
    
    clearTrackingAnime(channel, callback){
        var channels = this.client.animeRelease.release_channels;
        var found = false;
        
        channels.forEach(chh => {
            if(chh.channel_id == channel.id){
                found = true
                chh.tracking = '';
                Channels.collection.updateOne({channel_id: channel.id}, { $set: {tracking: chh.tracking}}, (err, docs) => {
                    if(err){
                        callback(true, {message: 'Failed to update the tracking list.'})
                        return
                    }
                    callback(false, {message: 'Successfully cleared tracking list'})
                })
            }
        })
        if(!found) callback(true, {message: 'This channel is not an anime release channel.'})
    }
    
    filterName(string){
        return string.toLowerCase().replace(' ', '').replace('\t', '')
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
            }
        })
        
        if(found){
            callback(true, {message: 'This channel is already an anime release channel.'})
            return;
        }
        
        const chh = {
            channel_id: id, 
            tracking: ''
        };
        
        releaseChannels.push(chh)
        Channels.collection.insertOne(chh, (err, docs) => {
            if(err){
                callback(true, {message: 'Failed to add this channel to databse.'})
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
        if(!found) callback(true, {message: 'This channel was not found in database.'})
    }
}

module.exports = DBApi
