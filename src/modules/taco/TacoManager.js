const Discord = require('discord.js');
const Taco = require('./models/taco.js');
const TacoRemindersCommand = require('./cmds/taco-reminders.js');

const TIPS = 300000; //5m
const WORK = 600000; //10m
const OVERTIME = 1800000; //30m
const CLEAN = 86400000; //1d
const DAILY = 86400000; //1d
const VOTE = 43200000; //12h

const FLIPPER = 28800000; //8h
const KARAOKE = 21600000; //6h
const MUSIC = 14400000; //4h
const AIRPLANE = 86400000; //1d
const CHEF = 14400000; //4h

const CHAIRS = 28800000; //8h
const SAIL = 21600000; //6h
const CONCERT = 14400000; //4h
const TOURS = 86400000; //1d
const HAMMOCK = 14400000; //4h

const DELIVERY = 28800000; //8h
const MASCOT = 21600000; //6h
const SAMPLES = 14400000; //4h
const BUS = 86400000; //1d
const HAPPY = 14400000; //4h

class TacoManager {
    constructor(client){
        this.client = client;

        this.tips = new Discord.Collection();
        this.work = new Discord.Collection();
        this.overtime = new Discord.Collection();
        this.daily = new Discord.Collection();
        this.clean = new Discord.Collection();
        this.vote = new Discord.Collection();
        this.buy = new Discord.Collection();

        this.flipper = new Discord.Collection();
        this.karaoke = new Discord.Collection();
        this.music = new Discord.Collection();
        this.airplane = new Discord.Collection();
        this.chef = new Discord.Collection();

        this.chairs = new Discord.Collection();
        this.sail = new Discord.Collection();
        this.concert = new Discord.Collection();
        this.tours = new Discord.Collection();
        this.hammock = new Discord.Collection();

        this.delivery = new Discord.Collection();
        this.mascot = new Discord.Collection();
        this.samples = new Discord.Collection();
        this.bus = new Discord.Collection();
        this.happy = new Discord.Collection();

        this.cmdManager = this.client.commandManager;
        this.loadCommands()
        this.run()
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

                        case "flipper":
                            this.flipper.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "karaoke":
                            this.karaoke.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "music":
                            this.music.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "airplane":
                            this.airplane.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "chef":
                            this.chef.set(userId, {time: time, channel: channel, user: user})
                        break;

                        /* Beach commands */
                        case "chairs":
                            this.chairs.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "sail":
                            this.sail.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "concert":
                            this.concert.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "tours":
                            this.tours.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "hammock":
                            this.hammock.set(userId, {time: time, channel: channel, user: user})
                        break;

                        /* City commands */
                        case "delivery":
                            this.delivery.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "mascot":
                            this.mascot.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "samples":
                            this.samples.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "bus":
                            this.bus.set(userId, {time: time, channel: channel, user: user})
                        break;

                        case "happy":
                            this.happy.set(userId, {time: time, channel: channel, user: user})
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
                channel.send('**'+ user.username +'**, Tips ready!')
                this.tips.delete(id)
            }
        })

        this.work.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send('**'+ user.username +'**, Work ready!')
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

        
        /*
        * Buy commands
        */
        this.flipper.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Flipper ready to purchase! [SHACK]')
                this.flipper.delete(id)
                this.removeTimer(id, "flipper")
            }
        })

        this.karaoke.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Karaoke ready to purchase! [SHACK]')
                this.karaoke.delete(id)
                this.removeTimer(id, "karaoke")
            }
        })

        this.music.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Music ready to purchase! [SHACK]')
                this.music.delete(id)
                this.removeTimer(id, "music")
            }
        })

        this.airplane.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Airplane ready to purchase! [SHACK]')
                this.airplane.delete(id)
                this.removeTimer(id, "airplane")
            }
        })

        this.chef.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Chef ready to purchase! [SHACK]')
                this.chef.delete(id)
                this.removeTimer(id, "chef")
            }
        })

        /*
        * Beach
        */

        this.chairs.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Chairs ready to purchase! [BEACH]')
                this.chairs.delete(id)
                this.removeTimer(id, "chairs")
            }
        })

        this.sail.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Sail ready to purchase! [BEACH]')
                this.sail.delete(id)
                this.removeTimer(id, "sail")
            }
        })

        this.concert.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Concert ready to purchase! [BEACH]')
                this.concert.delete(id)
                this.removeTimer(id, "concert")
            }
        })

        this.tours.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Tours ready to purchase! [BEACH]')
                this.tours.delete(id)
                this.removeTimer(id, "tours")
            }
        })

        this.hammock.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Hammock ready to purchase! [BEACH]')
                this.hammock.delete(id)
                this.removeTimer(id, "hammock")
            }
        })


        this.delivery.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Delivery ready to purchase! [CITY]')
                this.delivery.delete(id)
                this.removeTimer(id, "delivery")
            }
        })

        this.mascot.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Mascot ready to purchase! [CITY]')
                this.mascot.delete(id)
                this.removeTimer(id, "mascot")
            }
        })

        this.samples.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Samples ready to purchase! [CITY]')
                this.samples.delete(id)
                this.removeTimer(id, "samples")
            }
        })

        this.bus.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Bus ready to purchase! [CITY]')
                this.bus.delete(id)
                this.removeTimer(id, "bus")
            }
        })

        this.happy.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user.mention +', Happy Hours ready to purchase! [CITY]')
                this.happy.delete(id)
                this.removeTimer(id, "happy")
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

                case "buy":
                    var sub = args[1].toLowerCase()

                    switch(sub){
                        case "flipper":
                            if(!this.flipper.has(userId) || force){
                                this.addTimer(userId, 'flipper', now + FLIPPER, channel_id, user)
                                this.flipper.set(userId, {time: now + FLIPPER, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "karaoke":
                            if(!this.karaoke.has(userId) || force){
                                this.addTimer(userId, 'karaoke', now + KARAOKE, channel_id, user)
                                this.karaoke.set(userId, {time: now + KARAOKE, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;
                        
                        case "music":
                            if(!this.music.has(userId) || force){
                                this.addTimer(userId, 'music', now + MUSIC, channel_id, user)
                                this.music.set(userId, {time: now + MUSIC, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "airplane":
                            if(!this.airplane.has(userId) || force){
                                this.addTimer(userId, 'airplane', now + AIRPLANE, channel_id, user)
                                this.airplane.set(userId, {time: now + AIRPLANE, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "chef":
                            if(!this.chef.has(userId) || force){
                                this.addTimer(userId, 'chef', now + CHEF, channel_id, user)
                                this.chef.set(userId, {time: now + CHEF, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        /* Beach commands */
                        case "chairs":
                            if(!this.chairs.has(userId) || force){
                                this.addTimer(userId, 'chairs', now + CHAIRS, channel_id, user)
                                this.chairs.set(userId, {time: now + CHAIRS, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "sail":
                            if(!this.sail.has(userId) || force){
                                this.addTimer(userId, 'sail', now + SAIL, channel_id, user)
                                this.sail.set(userId, {time: now + SAIL, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;
                        
                        case "concert":
                            if(!this.concert.has(userId) || force){
                                this.addTimer(userId, 'concert', now + CONCERT, channel_id, user)
                                this.concert.set(userId, {time: now + CONCERT, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "tours":
                            if(!this.tours.has(userId) || force){
                                this.addTimer(userId, 'tours', now + TOURS, channel_id, user)
                                this.tours.set(userId, {time: now + TOURS, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "hammock":
                            if(!this.hammock.has(userId) || force){
                                this.addTimer(userId, 'hammock', now + HAMMOCK, channel_id, user)
                                this.hammock.set(userId, {time: now + HAMMOCK, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        /* City commands */
                        case "delivery":
                            if(!this.delivery.has(userId) || force){
                                this.addTimer(userId, 'delivery', now + DELIVERY, channel_id, user)
                                this.delivery.set(userId, {time: now + DELIVERY, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "mascot":
                            if(!this.mascot.has(userId) || force){
                                this.addTimer(userId, 'mascot', now + MASCOT, channel_id, user)
                                this.mascot.set(userId, {time: now + MASCOT, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "samples":
                            if(!this.samples.has(userId) || force){
                                this.addTimer(userId, 'samples', now + SAMPLES, channel_id, user)
                                this.samples.set(userId, {time: now + SAMPLES, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "bus":
                            if(!this.bus.has(userId) || force){
                                this.addTimer(userId, 'bus', now + BUS, channel_id, user)
                                this.bus.set(userId, {time: now + BUS, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;

                        case "happy":
                            if(!this.happy.has(userId) || force){
                                this.addTimer(userId, 'happy', now + HAPPY, channel_id, user)
                                this.happy.set(userId, {time: now + HAPPY, channel: channel, user: {mention: user.toString(), username: user.username}})
                            }
                        break;
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