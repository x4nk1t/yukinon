const Discord = require('discord.js');
const Taco = require('./models/taco.js');
const TacoRemindersCommand = require('./cmds/taco-reminders.js');

const TIPS = 300000; //5m
const WORK = 600000; //10m
const OVERTIME = 1800000; //30m
const CLEAN = 86400000; //1d
const DAILY = 86400000; //1d
const VOTE = 43200000; //12h

class TacoManager {
    constructor(client){
        this.client = client;

        this.tips = new Discord.Collection();
        this.work = new Discord.Collection();
        this.overtime = new Discord.Collection();
        this.daily = new Discord.Collection();
        this.clean = new Discord.Collection();
        this.vote = new Discord.Collection();

        this.cmdManager = this.client.commandManager;
        this.loadCommands()
    }
    
    loadCommands(){
        this.cmdManager.loadCommand(new TacoRemindersCommand(this.cmdManager))
    }

    async run(){
        this.client.on('message', message => {
            if(message.author.bot) return;
            
            if(message.content.toLowerCase().startsWith('t')){
                if(!this.client.devMode){ this.execute(message) }
            }
        })

        await this.getTacoReminders().then(datas => { 
            var now = new Date().getTime();
            var removeList = [];

            datas.forEach(data => {
                var userId = data.user_id;
                var type = data.type;
                var time = data.time;
                var channel = this.client.channels.cache.get(data.channel_id)
                var user = {mention: data.mention, username: data.username}

                if((time - now) >= 0){
                    switch(type){
                        case "overtime":
                            this.overtime.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "clean":
                            this.clean.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "daily":
                            this.daily.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "vote":
                            this.vote.set(userId, {time: time, channel: channel, user: user})
                        break;
                    }
                } else {
                    removeList.push(data._id)
                }
            })

            if(removeList.length) this.removeMany(removeList)
            setInterval(() => this.checkReminders(), 1000)
        }).catch(console.log)
    }
    
    checkReminders(){
        var now = new Date().getTime()

        this.tips.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.username +', Tips ready!')
                this.tips.delete(id)
            }
        })

        this.work.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.username +', Work ready!')
                this.work.delete(id)
            }
        })

        this.overtime.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Overtime ready!')
                this.overtime.delete(id)
                this.removeTimer(id, "overtime")
            }
        })

        this.clean.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Clean ready!')
                this.clean.delete(id)
                this.removeTimer(id, "clean")
            }
        })

        this.daily.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Daily ready!')
                this.daily.delete(id)
                this.removeTimer(id, "daily")
            }
        })

        this.vote.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Vote Claim ready!')
                this.vote.delete(id)
                this.removeTimer(id, "vote")
            }
        })
    }

    execute(message){
        var args = message.content.split(' ')
        var now = new Date().getTime()
        
        if(message.channel.name != "taco") return
         
        if(args[0]){
            var cmd = args[0].substring(1);
            var force = (args[args.length - 1] == "-f") ? true : false;
            var channel = message.channel;
            var channel_id = channel.id;
            var user = message.author;
            var userId = user.id;
            
            switch(cmd){
                case "t":
                case "tips":
                case "tip":
                    if(!this.tips.has(userId) || force){
                        this.tips.set(userId, {time: now + TIPS, channel: channel, user: {mention: user.toString(), username: user.username}})
                    }
                break;

                case "w":
                case "work":
                    if(!this.work.has(userId) || force){
                        this.work.set(userId, {time: now + WORK, channel: channel, user: {mention: user.toString(), username: user.username}})
                    }
                break;

                case "ot":
                case "overtime":
                    if(!this.overtime.has(userId) || force){
                        this.addTimer(userId, 'overtime', now + OVERTIME, channel_id, user)
                        this.overtime.set(userId, {time: now + OVERTIME, channel: channel, user: {mention: user.toString(), username: user.username}})
                    }
                break;

                case "clean":
                    if(!this.clean.has(userId) || force){
                        this.addTimer(userId, 'clean', now + CLEAN, channel_id, user)
                        this.clean.set(userId, {time: now + CLEAN, channel: channel, user: {mention: user.toString(), username: user.username}})
                    }
                break;

                case "daily":
                    if(!this.daily.has(userId) || force){
                        this.addTimer(userId, 'daily', now + DAILY, channel_id, user)
                        this.daily.set(userId, {time: now + DAILY, channel: channel, user: {mention: user.toString(), username: user.username}})
                    }
                break;

                case "claim":
                    if(!this.vote.has(userId) || force){
                        this.addTimer(userId, 'vote', now + VOTE, channel_id, user)
                        this.vote.set(userId, {time: now + VOTE, channel: channel, user: {mention: user.toString(), username: user.username}})
                    }
                break;
            }
        }
    }

    getTacoReminders(){
        return new Promise((resolve, reject) => {
            Taco.collection.find({}, async (err, tacos) => {
                if(err){
                    this.client.logger.error(err)
                    reject(err)
                    return
                }
                const array = await tacos.toArray()
                resolve(array)
            })
        })
    }

    addTimer(userId, type, time, channelId, user, callback = () => {}){
        Taco.collection.findOneAndUpdate({user_id: userId, type: type, channel_id: channelId, username: user.username, mention: user.toString()}, {$set: {time: time}}, {upsert: true}, err => {
            if(err){
                this.client.logger.error(err)
                callback(true, {message: 'Failed to add new timer.'})
                return
            }
            callback(false, {message: 'Successfully added to database.'})
        })
    }
    
    removeMany(options, callback = () => {}){
        Taco.collection.removeMany({
            _id: {
                $in: options
            }
        }, err => {
            if(err){
                this.client.logger.error(err)
                callback(true, {message: 'Failed to remove many timer.'})
                return
            }
            callback(false, {message: 'Successfully removed many timer.'})
        })
    }
    
    removeTimer(userId, type, callback = () => {}){
        Taco.collection.removeOne({user_id: userId, type: type}, err => {
            if(err){
                this.client.logger.error(err)
                callback(true, {message: 'Failed to remove timer.'})
                return
            }
            callback(false, {message: 'Successfully added to database.'})
        })
    }
}

module.exports = TacoManager