const Feed = require("./cmds/feed");
const RedditChannels = require("./models/RedditChannels");
const RedditGrabber = require("./RedditGrabber");

class RedditManager {
    constructor(client){
        this.client = client;
        this.cmdManager = client.commandManager;
        this.reddit_channels = [];

        this.loadCommands()
        this.run()
    }

    loadCommands(){
        this.cmdManager.loadCommand(new Feed(this.cmdManager));
    }

    run(){
        RedditChannels.collection.find({}, async (err, data) => {
            if(err){
                this.client.logger.error('Couldn\'t load reddit channel data.')
                setTimeout(() => { this.run() }, 10000) //Try again in 10sec
            }
            const arr = await data.toArray()
            this.reddit_channels = arr;
            
            this.redditGrabber = new RedditGrabber(this.client)
        })
    }

    sendPosts(posts){
        posts.forEach(post => {
            this.reddit_channels.forEach(channel => {
                const id = channel.channel_id;
                const subreddits = channel.subreddits;
    
                if(subreddits.includes(post.subreddit)){
                    const text_channel = this.client.channels.cache.get(id);
                    if(text_channel == null) return

                    const embed = {
                        color: 'RED',
                        title: post.title,
                        url: post.permalink,
                        timestamp: new Date(),
                    }

                    if(this.isImageLink(post.url)){
                        embed.image = {
                            url: post.url,
                        }
                    } else {
                        embed.description = "[Link to post!]("+ post.permalink +")"
                    }

                    text_channel.send({embed: embed})
                }
            })
        })
    }

    isImageLink(link){
        return link.endsWith('.jpg') || link.endsWith('.png') || link.endsWith('.gif');
    }

    updateSubOfChannel(channel_id, update){
        return new Promise((resolve, reject) => {
            RedditChannels.collection.findOneAndUpdate({channel_id: channel_id}, {$set: update}, {upsert: true},  (err) => {
                if(err){
                    this.client.logger.error('Something went wrong while linking sub to channel.')
                    this.client.logger.error(err)
                    reject({error: 1})
                    return
                }
                resolve({error: 0})
            })
        })
    }
}

module.exports = RedditManager