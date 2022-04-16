const Discord = require('discord.js');
const axios = require('axios');

const Taco = require('./models/taco.js');
const Location = require('./models/location.js');
const Sauces = require('./models/sauce.js')
const TacoRemindersCommand = require('./cmds/taco-reminders.js');
const SauceMarketCommand = require('./cmds/sauce-market.js')
const botSettings = require('../../utils/models/bot-settings.js');

const TIPS = 300000; //5m
const WORK = 600000; //10m
const OVERTIME = 1800000; //30m

const TWELVE_HOURS = 43200000; //12h
const EIGHT_HOURS = 28800000; //8h
const SIX_HOURS = 21600000; //6h
const FOUR_HOURS = 14400000; //4h
const ONE_DAY = 86400000; //1d

class TacoManager {
    constructor(client){
        this.client = client;

        this.users = new Discord.Collection();
        this.tacoCommands = [
            "t", "tips", "tip",
            "w", "work",
            "ot", "overtime",
            "d", "daily",
            "clean", "claim", "buy"
        ];

        this.notToPing = ['tips', 'work']

        this.tacoCommandsTime = new Discord.Collection()
        this.tacoBuySubcommands = new Discord.Collection();
        this.currentTacoLocations = new Discord.Collection();

        this.timerStorage = new Discord.Collection();

        this.sauceChannels = new Discord.Collection();

        this.upArrow = '<:green_arrow_up:964683055761612860>';
        this.downArrow = ':small_red_triangle_down:';

        this.cmdManager = this.client.commandManager;

        this.registerSubcommands()
        this.loadCommands()
        this.run()
    }
    
    loadCommands(){
        this.cmdManager.loadCommand(new TacoRemindersCommand(this.cmdManager))
        this.cmdManager.loadCommand(new SauceMarketCommand(this.cmdManager))
    }

    registerSubcommands(){
        this.tacoCommandsTime.set('t', TIPS);
        this.tacoCommandsTime.set('tip', TIPS);
        this.tacoCommandsTime.set('tips', TIPS);

        this.tacoCommandsTime.set('w', WORK);
        this.tacoCommandsTime.set('work', WORK);
        this.tacoCommandsTime.set('cook', WORK);

        this.tacoCommandsTime.set('ot', OVERTIME);
        this.tacoCommandsTime.set('overtime', OVERTIME);

        this.tacoCommandsTime.set('clean', ONE_DAY);
        this.tacoCommandsTime.set('daily', ONE_DAY);
        this.tacoCommandsTime.set('d', ONE_DAY);
        this.tacoCommandsTime.set('claim', TWELVE_HOURS);
        this.tacoCommandsTime.set('reward', TWELVE_HOURS);

        this.tacoBuySubcommands.set("shack",
            new Discord.Collection([
                ["flipper", {time: EIGHT_HOURS}],
                ["karaoke", {time: SIX_HOURS}],
                ["music", {time: FOUR_HOURS}],
                ["airplane", {time: ONE_DAY}],
                ["chef", {time: FOUR_HOURS}],
            ])
        );

        this.tacoBuySubcommands.set("beach",
            new Discord.Collection([
                ["chairs", {time: EIGHT_HOURS}],
                ["sail", {time: SIX_HOURS}],
                ["concert", {time: FOUR_HOURS}],
                ["tours", {time: ONE_DAY}],
                ["hammock", {time: FOUR_HOURS}],
            ])
        );

        this.tacoBuySubcommands.set("city",
            new Discord.Collection([
                ["delivery", {time: EIGHT_HOURS}],
                ["mascot", {time: SIX_HOURS}],
                ["samples", {time: FOUR_HOURS}],
                ["bus", {time: ONE_DAY}],
                ["happy", {time: FOUR_HOURS}],
            ])
        );
    }

    async run(){
        this.client.on('messageCreate', message => {
            if(message.author.bot && message.channel.name != "taco") return

            if(message.content.toLowerCase().startsWith('t')){
                if(!this.client.devMode){
                    var args = message.content.split(' ');

                    if(args[0]){
                        var cmd = args[0].substring(1).toLowerCase();

                        if(cmd == "l" || cmd =="location" || cmd == "locations"){
                            var sub = args[1] ? args[1].toLowerCase() : null;

                            if(!sub) return

                            if(sub == "shack" || sub == "beach" || sub == "city"){
                                this.setTacoLocation(message.author.id, sub);
                                this.currentTacoLocations.set(message.author.id, sub);
                            }

                            return
                        }

                        if(cmd == "buy"){
                            var boosts = args[1] ? args[1].toLowerCase() : null;
                            var all = args[2] ? args[2].toLowerCase() : null;

                            var user = message.author;
                            var userId = user.id;

                            if(!boosts && !all) return

                            if(boosts == "boosts" && all == "all"){
                                var location = this.currentTacoLocations.get(userId);

                                if(!location) return

                                var subCommands = this.tacoBuySubcommands.get(location);
                                for(let [boost, value] of subCommands){
                                    var channel = message.channel;
                                    var channel_id = channel.id;

                                    var now = new Date().getTime();
                                    var time = value.time;
                                    var timers = this.timerStorage.get(userId);

                                    if(!timers) timers = new Discord.Collection();

                                    if(!timers.has(boost)){
                                        this.addTimer(userId, boost, now + time, channel_id, user);
                                        timers.set(boost, {time: now + time, channel: channel, user: {mention: user.toString(), username: user.username}})
                                        this.timerStorage.set(userId, timers);
                                    }

                                }
                            }
                        }
                    }

                    this.execute(message);
                }
            }
        })

        await this.getSauceChannels().then(datas => {
            datas.forEach(data => {
                var channel_id = data.channel_id;
                var last_updated = data.last_updated;

                this.sauceChannels.set(channel_id, {last_updated: last_updated});
            })

            this.setSauceMarketTimeout()
        })

        await this.getTacoLocations().then(datas => {
            datas.forEach(data => {
                var userId = data.user_id;
                var location = data.location;

                this.currentTacoLocations.set(userId, location);
            })
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
                    var timers = this.timerStorage.get(userId);

                    if(!timers) timers = new Discord.Collection();

                    timers.set(type, {time: time, channel: channel, user: user});

                    this.timerStorage.set(userId, timers);
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

        for(let [key, timers] of this.timerStorage){
            var userId = key;

            for(let [sub, value] of timers){
                var time = value.time;
                var channel = value.channel;
                var user = value.user;
                var location = this.getLocationOfThis(sub);
                var locationFormat = "";

                if(location != '') locationFormat = '['+ location +']';

                var ping = '**'+ user.username +'**';
                if(!this.notToPing.includes(sub)){
                    ping = user.mention;
                }
                if((time - now) <= 0){
                    channel.send(ping + ', '+ this.capitalizeFirstLetter(sub) +' ready! '+ locationFormat);
                    timers.delete(sub)

                    this.timerStorage.set(userId, timers);
                    this.removeTimer(userId, sub)
                }
            }
        }
    }

    execute(message){
        var args = message.content.split(' ')
        var now = new Date().getTime()

        if(args[0]){
            var cmd = args[0].substring(1).toLowerCase();
            var force = (args[args.length - 1] == "-f") ? true : false;
            var channel = message.channel;
            var channel_id = channel.id;
            var user = message.author;
            var userId = user.id;

            if(!this.tacoCommands.includes(cmd)) return

            for(let [key, time] of this.tacoCommandsTime){
                if(key == this.getFullCommand(cmd)){
                    var timers = this.timerStorage.get(userId);

                    if(!timers) timers = new Discord.Collection();
                    
                    if(!timers.has(key) || force){
                        if(!this.notToPing.includes(key)) this.addTimer(userId, key, now + time, channel_id, user);
                        timers.set(key, {time: now + time, channel: channel, user: {mention: user.toString(), username: user.username}})
                        
                        this.timerStorage.set(userId, timers);
                    }
                }
            }

            if(cmd == "buy"){
                var sub = args[1].toLowerCase();
                var currentTacoLocations = this.currentTacoLocations.get(userId);
                var locationSubCommands = this.tacoBuySubcommands.get("shack");

                if(currentTacoLocations){
                    locationSubCommands = this.tacoBuySubcommands.get(currentTacoLocations);
                }

                if(!this.isValidSubCommand(sub)) return;

                var subCommandDetails = locationSubCommands.get(sub);

                if(subCommandDetails){
                    var timers = this.timerStorage.get(userId);

                    if(!timers) timers = new Discord.Collection()

                    if(!timers.has(sub) || force){
                        this.addTimer(userId, sub, now + subCommandDetails.time, channel_id, user);
                        timers.set(sub, {time: now + subCommandDetails.time, channel: channel, user: {mention: user.toString(), username: user.username}})

                        this.timerStorage.set(userId, timers);
                    }
                }
            }
        }
    }

    setSauceMarketTimeout(){
        const now = new Date();
        const time = now.getTime();
        
        var refreshTime = (new Date(new Date().setUTCHours(now.getUTCHours(),10))).getTime()

        if(now.getUTCMinutes() >= 10){
            refreshTime = (new Date(new Date().setUTCHours(now.getUTCHours() + 1,10))).getTime()
        }

        const diff = (refreshTime - time)

        setTimeout(async () => {
            await this.sendSauceMarket()
            this.setRefreshTimeout()
        }, diff)
    }

    async sendSauceMarket(){
        const sauceMarketData = await this.getSauceMarket();

        const embed = {
            color: 'BLUE',
            author: {
                name: 'Sauce Market',
            },
            fields: [
                {
                    name: 'Salsa',
                    value: this.getSauceEmbedValue(sauceMarketData, 'salsa')
                },
                {
                    name: 'Hotsauce',
                    value: this.getSauceEmbedValue(sauceMarketData, 'hotsauce')
                },
                {
                    name: 'Guacamole',
                    value: this.getSauceEmbedValue(sauceMarketData, 'guacamole')
                },
                {
                    name: 'Pico',
                    value: this.getSauceEmbedValue(sauceMarketData, 'pico')
                },
                {
                    name: 'Chipotle',
                    value: this.getSauceEmbedValue(sauceMarketData, 'chipotle')
                }
            ]
        }

        this.sauceChannels.forEach(async (value, key) => {
            const channel_id = key;
            const channel = await this.client.channels.fetch(channel_id).catch(err => {})
            if(channel) channel.send({embeds: [embed]}).catch(err => {})
        })
    }

    getSauceEmbedValue(marketData, sauce){
        var sauceData;
        switch(sauce){
            case 'salsa':
                sauceData = marketData.salsa;
            break;
            case 'hotsauce':
                sauceData = marketData.hotsauce;
            break;
            case 'guacamole':
                sauceData = marketData.guacamole;
            break;
            case 'pico':
                sauceData = marketData.pico;
            break;
            case 'chipotle':
                sauceData = marketData.chipotle;
            break;
        }

        var lastPrice = "";
        const priceDiff = sauceData.price - sauceData.history[0];

        if(priceDiff >= 0){
            lastPrice = `${this.upArrow} +$${priceDiff}`;
        } else {
            const positiveNumber = priceDiff.toString().replace("-", "");
            lastPrice = `${this.downArrow} -$${positiveNumber}`;
        }

        return `$${sauceData.price} | ${lastPrice}\nVol: ${sauceData.volume.toLocaleString()}`;
    }

    getSauceMarket(){
        return new Promise((resolve, reject) => {
            axios.get('https://tacoshack.online/api/saucemarket', {headers: {token: 123}}).then(ret => {
                resolve(ret.data)
            }).catch(err => {
                reject(err)
            })
        });
    }

    getSauceChannels(){
        return new Promise((resolve, reject) => {
            Sauces.collection.find({}, async (err, sauces) => {
                if(err){
                    this.client.logger.error(err)
                    reject(err)
                    return
                }
                const array = await sauces.toArray()
                resolve(array)
            })
        })
    }

    addSauceChannel(channel_id){
        return new Promise((resolve, reject) => {
            Sauces.collection.findOneAndUpdate({channel_id: channel_id}, {$set: {last_updated: new Date().getTime()}}, {upsert: true}, err => {
                if(err){
                    this.client.logger.error(err)
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }

    removeSauceChannel(channel_id){
        return new Promise((resolve, reject) => {
            Sauces.collection.findOneAndDelete({channel_id: channel_id}, err => {
                if(err){
                    this.client.logger.error(err)
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }

    capitalizeFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    isValidSubCommand(sub){
        for(let [key, location] of this.tacoBuySubcommands){
            for(let [key2, value2] of location){
                if(key2 == sub){
                    return true;
                }
            }
        }
        return false;
    }

    getFullCommand(cmd){
        if(cmd == "t" || cmd == "tips" || cmd == "tip"){
            return "tips";
        } else if(cmd == "w" || cmd == "work" || cmd == "cook"){
            return "work";
        } else if(cmd == "ot" || cmd == "overtime"){
            return "overtime";
        } else if(cmd == "d" || cmd == "daily"){
            return "daily";
        } else if(cmd == "claim" || cmd == "reward"){
            return "claim";
        } else {
            return cmd;
        }
    }

    getLocationOfThis(cmd){
        for(let [key, location] of this.tacoBuySubcommands){
            for(let [key2, value2] of location){
                if(key2 == cmd){
                    return key.toUpperCase();
                }
            }
        }
        return "";
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

    getTacoLocations(){
        return new Promise((resolve, reject) => {
            Location.collection.find({}, async (err, location) => {
                if(err){
                    this.client.logger.error(err)
                    reject(err)
                    return
                }
                const array = await location.toArray()
                resolve(array)
            })
        })
    }

    setTacoLocation(userId, location,  callback = () => {}){
        Location.collection.findOneAndUpdate({user_id: userId}, {$set: {location: location}}, {upsert: true}, err => {
            if(err){
                this.client.logger.error(err)
                callback(true, {message: 'Failed to set taco location.'})
                return
            }
            callback(false, {message: 'Successfully added location to database.'})
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
        Taco.collection.deleteMany({
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
        Taco.collection.findOneAndDelete({user_id: userId, type: type}, err => {
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