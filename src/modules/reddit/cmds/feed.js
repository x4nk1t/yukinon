const Command = require('../../../utils/Command.js');

class Feed extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "feed",
            description: "Subscribe/Unsubscribe to the sub reddit.",
            usage: '<sub/unsub> <subreddit name>',
            guildOnly: false
        });
    }

    async execute(message, commandArgs){
        const manager = this.client.redditManager;

        if(commandArgs[0] && commandArgs[1]){
            const channel = message.channel;
            const sub_unsub = commandArgs[0].toLowerCase();
            const subreddit = commandArgs[1].toLowerCase();
            
            if(sub_unsub == "sub"){
                if(this.isSubscribedTo(channel.id, subreddit)){
                    message.channel.send(this.embed('`'+ commandArgs[1] +'` is already being subscribed!'))
                    return
                } else {
                    const list = this.getSubredditList(channel.id)
                    list.push(subreddit)
                    const update = {subreddits: list}
                    const response = await manager.updateSubOfChannel(channel.id, update)

                    if(response.error == 0){
                        manager.reddit_channels.push({channel_id: channel.id, subreddits: list})
                        message.channel.send(this.embed('`'+ commandArgs[1] +'` has been subscribed!'))
                    } else {
                        message.channel.send(this.embed('Something went wrong while subscribing to `'+ commandArgs[1] +'`'))
                    }
                }
            } else if(sub_unsub == "unsub"){
                if(this.isSubscribedTo(channel.id, subreddit)){
                    const list = this.getSubredditList(channel.id)
                    list.splice(list.indexOf(subreddit), 1)
                    const update = {subreddits: list}
                    const response = await manager.updateSubOfChannel(channel.id, update)

                    if(response.error == 0){
                        manager.reddit_channels.some(channels => {
                            if(channels.id == channel.id){
                                channels.subreddits = list;
                            }
                        })
                        message.channel.send(this.embed('`'+ commandArgs[1] +'` has been unsubscribed!'))
                    } else {
                        message.channel.send(this.embed('Something went wrong while unsubscribing to `'+ commandArgs[1] +'`'))
                    }
                } else {
                    message.channel.send(this.embed('`'+ commandArgs[1] +'` isn\'t being subscribed!'))
                    return
                }
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }

    embed(message){
        return {
            embed: {
                color: 'BLUE',
                description: message
            }
        }
    }

    isRedditChannel(channel_id){
        var found = false;
        const channels = this.client.redditManager.reddit_channels;

        channels.forEach(channel => {
            if(channel.channel_id == channel_id){
                found = true;
            }
        });

        return found
    }

    isSubscribedTo(channel_id, subreddit){
        if(this.isRedditChannel(channel_id)){
            var found = false;
            const channels = this.client.redditManager.reddit_channels;

            channels.forEach(channel => {
                if(channel.channel_id == channel_id){
                    found = channel.subreddits.includes(subreddit)
                }
            });

            return found;
        } else {
            return false;
        }
    }

    getSubredditList(channel_id){
        if(this.isRedditChannel(channel_id)){
            var list = [];
            const channels = this.client.redditManager.reddit_channels;

            channels.forEach(channel => {
                if(channel.channel_id == channel_id){
                    list = channel.subreddits;
                }
            });

            return list;
        } else {
            return [];
        }
    }
}

module.exports = Feed