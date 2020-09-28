const Discord = require('discord.js')
const Timer = require('../network/database/models/timer.js')

const LOOTBOX = 10800000; //3hrs
const GUILD = 7200000; //2hrs
const HUNT = 60000; //1min
const ADVENTURE = 3600000; //1hr
const TRAINING = 900000; //15min
const PROGRESS = 300000; //5min

class RPGReminder {
    constructor(client){
        this.client = client;
        
        this.hunt = new Discord.Collection();
        this.adventure = new Discord.Collection();
        this.progress = new Discord.Collection();
        this.training = new Discord.Collection();
        this.guild = new Discord.Collection();
        this.lootbox = new Discord.Collection();
    }
    
    execute(message){
        var args = message.content.split(' ')
        args.shift()
        var now = new Date().getTime()
        
        if(args[0]){
            var sc = args[0].toLowerCase()
            var force = (args[args.length - 1] == "-f") ? true : false;
            var userId = message.author.id;
            var channel = message.channel;
            var channel_id = channel.id;

            if(message.channel.name != "rpg"){
                return;
            }
            
            if(sc == "buy"){
                if(args[1] && args[2]){
                    if(args[2] == "lootbox"){
                        if(!this.lootbox.has(userId) || force){
                            this.addTimer(userId, "lootbox", now + LOOTBOX, channel_id)
                            this.lootbox.set(userId, {time: now + LOOTBOX, channel: channel})
                        }
                    }
                }
            }

            if(sc == "guild"){
                if(args[1]){
                    if(args[1] == "raid" || args[1] == "upgrade"){
                        if(!this.guild.has(message.guild.id) || force){
                            this.addTimer(message.guild.id, "guild", now + GUILD, channel_id)
                            this.guild.set(message.guild.id, {time: now + GUILD, channel: channel})
                        }
                    }
                }
            }

            if(sc == "hunt"){
                if(!this.hunt.has(message.author.id) || force){
                    this.addTimer(userId, "hunt", now + HUNT, channel_id)
                    this.hunt.set(message.author.id, {time: now + HUNT, channel: channel})
                }
            }

            if(sc == "adv" || sc == "adventure"){
                if(!this.adventure.has(message.author.id) || force){
                    this.addTimer(userId, "adventure", now + ADVENTURE, channel_id)
                    this.adventure.set(message.author.id, {time: now + ADVENTURE, channel: channel})
                }
            }

            if(sc == "training"){
                if(!this.training.has(message.author.id) || force){
                    this.addTimer(userId, "training", now + TRAINING, channel_id)
                    this.training.set(message.author.id, {time: now + TRAINING, channel: channel})
                }
            }

            if(sc == "chop" || sc == "fish" ||
               sc == "axe" || sc == "net" ||
               sc == "pickup" || sc == "ladder" ||
               sc == "mine" || sc == "bowsaw" ||
               sc == "boat" || sc == "pickaxe" ||
               sc == "tractor" || sc == "chainsaw" ||
               sc == "bigboat"){
                if(!this.progress.has(message.author.id) || force){
                    this.addTimer(userId, "progress", now + PROGRESS, channel_id)
                    this.progress.set(message.author.id, {time: now + PROGRESS, channel: channel})
                }
            }
        }
    }
    
    run(){
        this.getAllTimers((err, timers) => {
            var now = new Date().getTime();
            var removeList = [];
            
            timers.forEach(data => {
                var userId = data.user_id;
                var type = data.type;
                var time = data.time;
                var channel = this.client.channels.cache.get(data.channel_id)
                
                if((time - now) >= 0){
                    if(type == "hunt"){
                        this.hunt.set(userId, {time: time, channel: channel})
                    }
                    if(type == "adventure"){
                        this.adventure.set(userId, {time: time, channel: channel})
                    }
                    if(type == "training"){
                        this.training.set(userId, {time: time, channel: channel})
                    }
                    if(type == "progress"){
                        this.progress.set(userId, {time: time, channel: channel})
                    }
                    if(type == "guild"){
                        this.guild.set(userId, {time: time, channel: channel})
                    }
                    if(type == "lootbox"){
                        this.lootbox.set(userId, {time: time, channel: channel})
                    }
                } else {
                    removeList.push(data._id)
                }
            })
            if(removeList.length) this.removeMany(removeList)
            setInterval(() => this.checkReminders(), 1000)
        })
    }
    
    checkReminders(){
        var now = new Date().getTime()
        
        this.lootbox.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.cache.get(id)
                channel.send(user.toString() +', Lootbox ready!')
                this.lootbox.delete(id)
                this.removeTimer(id, "lootbox")
            }
        })
        
        this.guild.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var role = message.guild.roles.cache.find(r => r.name.toLowerCase() == "rpg");
                var wtd = (new Date().getDay()) < 5 ? "Upgrade" : "Raid"; 
                
                channel.send(role.toString() +' Guild '+ wtd +' (Preferred)!')
                this.guild.delete(id)
                this.removeTimer(id, "guild")
            }
        })
        
        this.hunt.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.cache.get(id)
                channel.send(user.username +', Hunt Ready!')
                this.hunt.delete(id)
                this.removeTimer(id, "hunt")
            }
        })
        
        this.adventure.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.cache.get(id)
                channel.send(user.username +', Adventure Ready!')
                this.adventure.delete(id)
                this.removeTimer(id, "adventure")
            }
        })
        
        this.training.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.cache.get(id)
                channel.send(user.username +', Training Ready!')
                this.training.delete(id)
                this.removeTimer(id, "training")
            }
        })
        
        this.progress.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.cache.get(id)
                channel.send(user.author.username +', Progress Ready!')
                this.progress.delete(id)
                this.removeTimer(id, "progress")
            }
        })
    }
    
    /*
    * Database
    */
    
    addTimer(userId, type, time, channelId, callback = () => {}){
        Timer.collection.findOneAndUpdate({user_id: userId, type: type, channel_id: channelId}, {time: time}, {upsert: true}, err => {
            if(err){
                this.client.logger.error(err)
                callback(true, {message: 'Failed to add new timer.'})
                return
            }
            callback(false, {message: 'Successfully added to database.'})
        })
    }
    
    removeMany(options, callback = () => {}){
        Timer.collection.removeMany({
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
        Timer.collection.removeOne({user_id: userId, type: type}, err => {
            if(err){
                this.client.logger.error(err)
                callback(true, {message: 'Failed to remove timer.'})
                return
            }
            callback(false, {message: 'Successfully added to database.'})
        })
    }
    
    getAllTimers(callback){
        Timer.collection.find({}, async (err, timers) => {
            if(err){
                this.client.logger.error(err)
                callback(true, {message: 'Failed to fetch from database.'})
                return
            }
            const array = await timers.toArray()
            callback(false, array)
        })
    }
}

module.exports = RPGReminder
