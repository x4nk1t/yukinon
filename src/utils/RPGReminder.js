const Eris = require('eris')
const Timer = require('../network/database/models/timer.js')

const LOOTBOX = 10800000; //3hrs
const GUILD = 7200000; //2hrs
const HUNT = 60000; //1min
const ADVENTURE = 3600000; //1hr
const TRAINING = 900000; //15min
const PROGRESS = 300000; //5min
var MINIBOSS = 43200000; //12hr
const HORSE = 86400000; //1d
const ARENA = 86400000; //1d

class RPGReminder {
    constructor(client){
        this.client = client;
        
        this.hunt = new Eris.Collection();
        this.adventure = new Eris.Collection();
        this.progress = new Eris.Collection();
        this.training = new Eris.Collection();
        this.guild = new Eris.Collection();
        this.lootbox = new Eris.Collection();
        this.miniboss = new Eris.Collection();
        this.horse = new Eris.Collection();
        this.arena = new Eris.Collection();
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
            
            if(sc == "horse"){
                if(args[1]){
                    if(args[1] == "breeding"){
                        if(!message.mentions[0]) return
                        var member = message.channel.guild.members.get(message.mentions[0].id)
                        
                        if(member){
                            if(!this.horse.has(userId) || force){
                                this.addTimer(userId, "horse", now + HORSE, channel_id)
                                this.horse.set(userId, {time: now + HORSE, channel: channel})
                                
                                if(!this.horse.has(member.user.id) || force){
                                    if(member.user.id == "620152697450135552") {
                                        message.channel.createMessage('You cannot mention a GOD.')
                                        return
                                    } 
                                    this.addTimer(member.user.id, "horse", now + HORSE, channel_id)
                                    this.horse.set(member.user.id, {time: now + HORSE, channel: channel})
                                }
                            }
                        }
                    }
                    
                    if(args[1] == "race"){
                        if(!this.horse.has(userId) || force){
                            this.addTimer(userId, "horse", now + HORSE, channel_id)
                            this.horse.set(userId, {time: now + HORSE, channel: channel})
                        }
                    }
                }
            }

            if(sc == "guild"){
                if(args[1]){
                    if(args[1] == "raid" || args[1] == "upgrade"){
                        if(!this.guild.has(message.channel.guild.id) || force){
                            this.addTimer(message.channel.guild.id, "guild", now + GUILD, channel_id)
                            this.guild.set(message.channel.guild.id, {time: now + GUILD, channel: channel})
                        }
                    }
                }
            }

            if(sc == "hunt"){
                if(!this.hunt.has(userId) || force){
                    this.addTimer(userId, "hunt", now + HUNT, channel_id)
                    this.hunt.set(userId, {time: now + HUNT, channel: channel})
                }
            }

            if(sc == "adv" || sc == "adventure"){
                if(!this.adventure.has(userId) || force){
                    this.addTimer(userId, "adventure", now + ADVENTURE, channel_id)
                    this.adventure.set(userId, {time: now + ADVENTURE, channel: channel})
                }
            }

            if(sc == "training"){
                if(!this.training.has(userId) || force){
                    this.addTimer(userId, "training", now + TRAINING, channel_id)
                    this.training.set(userId, {time: now + TRAINING, channel: channel})
                }
            }
            
            if(sc == "miniboss"){
                var now = new Date().getTime()
                if(now < 1604617200000) MINIBOSS /= 2; 
                
                if(!this.miniboss.has(userId) || force){
                    this.addTimer(userId, "miniboss", now + MINIBOSS, channel_id)
                    this.miniboss.set(userId, {time: now + MINIBOSS, channel: channel})
                    
                    if(!message.mentions[0]) return
                    var member = message.channel.guild.members.get(message.mentions[0].id)
                
                    if(member){
                        if(member.user.id == "620152697450135552") {
                            message.channel.createMessage('You cannot mention a GOD.')
                            return
                        } 
                        this.addTimer(userId, "miniboss", now + MINIBOSS, channel_id)
                        this.miniboss.set(userId, {time: now + MINIBOSS, channel: channel})
                    }
                }
            }
            
            if(sc == "arena"){
                if(!this.arena.has(userId) || force){
                    this.addTimer(userId, "arena", now + ARENA, channel_id)
                    this.arena.set(userId, {time: now + ARENA, channel: channel})
                    
                    if(!message.mentions[0]) return
                    var member = message.channel.guild.members.get(message.mentions[0].id)
                    
                    if(member){
                        if(member.user.id == "620152697450135552") {
                            message.channel.createMessage('You cannot mention a GOD.')
                            return
                        }           
                        this.addTimer(member.user.id, "arena", now + ARENA, channel_id)
                        this.arena.set(member.user.id, {time: now + ARENA, channel: channel})
                    }
                }
            }

            if(sc == "chop" || sc == "fish" ||
               sc == "axe" || sc == "net" ||
               sc == "pickup" || sc == "ladder" ||
               sc == "mine" || sc == "bowsaw" ||
               sc == "boat" || sc == "pickaxe" ||
               sc == "tractor" || sc == "chainsaw" ||
               sc == "bigboat" || sc == "drill"){
                if(!this.progress.has(userId) || force){
                    this.addTimer(userId, "progress", now + PROGRESS, channel_id)
                    this.progress.set(userId, {time: now + PROGRESS, channel: channel})
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
                var channel = this.client.getChannel(data.channel_id)
                
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
                    if(type == "miniboss"){
                        this.miniboss.set(userId, {time: time, channel: channel})
                    }
                    if(type == "horse"){
                        this.horse.set(userId, {time: time, channel: channel})
                    }
                    if(type == "arena"){
                        this.arena.set(userId, {time: time, channel: channel})
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
                var user = this.client.users.get(id)
                channel.createMessage(user.mention +', Lootbox ready!')
                this.lootbox.delete(id)
                this.removeTimer(id, "lootbox")
            }
        })
        
        this.guild.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var role = channel.guild.roles.find(r => r.name.toLowerCase() == "rpg");
                var wtd = (new Date().getDay()) < 5 ? "Upgrade" : "Raid"; 
                
                channel.createMessage(role.mention +' Guild '+ wtd +' (Preferred)!')
                this.guild.delete(id)
                this.removeTimer(id, "guild")
            }
        })
        
        this.hunt.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.get(id)
                channel.createMessage('**'+ user.username +'**, Hunt Ready!')
                this.hunt.delete(id)
                this.removeTimer(id, "hunt")
            }
        })
        
        this.adventure.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.get(id)
                channel.createMessage('**'+ user.username +'**, Adventure Ready!')
                this.adventure.delete(id)
                this.removeTimer(id, "adventure")
            }
        })
        
        this.training.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.get(id)
                channel.createMessage('**'+ user.username +'**, Training Ready!')
                this.training.delete(id)
                this.removeTimer(id, "training")
            }
        })
        
        this.progress.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.get(id)
                channel.createMessage('**'+ user.username +'**, Progress Ready!')
                this.progress.delete(id)
                this.removeTimer(id, "progress")
            }
        })
        
        this.miniboss.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.get(id)
                channel.createMessage(user.mention +', Miniboss Ready!')
                this.miniboss.delete(id)
                this.removeTimer(id, "miniboss")
            }
        })
        
        this.horse.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.get(id)
                channel.createMessage(user.mention +', Horse Breed/Race Ready!')
                this.horse.delete(id)
                this.removeTimer(id, "horse")
            }
        })
        
        this.arena.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.get(id)
                channel.createMessage(user.mention +', Arena Ready!')
                this.arena.delete(id)
                this.removeTimer(id, "arena")
            }
        })
    }
    
    /*
    * Database
    */
    
    addTimer(userId, type, time, channelId, callback = () => {}){
        Timer.collection.findOneAndUpdate({user_id: userId, type: type, channel_id: channelId}, {$set: {time: time}}, {upsert: true}, err => {
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
