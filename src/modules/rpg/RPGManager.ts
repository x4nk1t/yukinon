import { Collection, Message, TextChannel, User } from 'discord.js';
import Timer from './models/timer.js';
import RpgRemindersCommand from './cmds/rpg-reminders.js';
import Client from '../../Client.js';
import CommandManager from '../../CommandManager.js';

const LOOTBOX = 10800000; //3hrs
const GUILD = 7200000; //2hrs
const HUNT = 60000; //1min
const FARM = 600000; //10min
const ADVENTURE = 3600000; //1hr
const TRAINING = 900000; //15min
const PROGRESS = 300000; //5min
const MINIBOSS = 43200000; //12hr
const HORSE = 86400000; //1d
const ARENA = 86400000; //1d

interface RPGInterface{
    time: number;
    channel: TextChannel;
    user?: {mention: string, username: string};
}

class RPGManager {
    client: Client;
    hunt: Collection<string, RPGInterface>;
    adventure: Collection<string, RPGInterface>;
    progress: Collection<string, RPGInterface>;
    farm: Collection<string, RPGInterface>;
    training: Collection<string, RPGInterface>;
    guild: Collection<string, RPGInterface>;
    lootbox: Collection<string, RPGInterface>;
    miniboss: Collection<string, RPGInterface>;
    horse: Collection<string, RPGInterface>;
    arena: Collection<string, RPGInterface>;
    commandManager: CommandManager;

    constructor(client: Client){
        this.client = client;
        
        this.hunt = new Collection();
        this.adventure = new Collection();
        this.progress = new Collection();
        this.farm = new Collection();
        this.training = new Collection();
        this.guild = new Collection();
        this.lootbox = new Collection();
        this.miniboss = new Collection();
        this.horse = new Collection();
        this.arena = new Collection();
        
        this.commandManager = this.client.commandManager;
        this.loadCommands()
        this.run()
    }
    
    loadCommands(){
        this.commandManager.loadCommand(new RpgRemindersCommand(this.commandManager))
    }
    
    execute(message: Message){
        const channel = <TextChannel>message.channel;
        var args = message.content.split(' ');
        args.shift();
        var now = new Date().getTime();
        
        if(channel.name != "rpg") return;
        if(!message.guild) return;
         
        if(args[0]){
            var sc = args[0].toLowerCase()
            var force = (args[args.length - 1] == "-f") ? true : false;
            var channel_id = channel.id;
            var user = message.author;
            var userId = user.id;
            
            if(sc == "buy"){
                if(args[1] && args[2]){
                    if(args[2] == "lootbox"){
                        if(!this.lootbox.has(userId) || force){
                            this.addTimer(userId, "lootbox", now + LOOTBOX, channel_id, user)
                            this.lootbox.set(userId, {time: now + LOOTBOX, channel: channel, user: {mention: user.toString(), username: user.username}})
                        }
                    }
                }
            }
            
            if(sc == "horse"){
                if(args[1]){
                    if(args[1] == "breeding"){
                        if(!message.mentions.users.first()) return
                        var member = message.guild.members.cache.get(message.mentions.users.first()!.id);
                        
                        if(member){
                            if(!this.horse.has(userId) || force){
                                this.addTimer(userId, "horse", now + HORSE, channel_id, user)
                                this.horse.set(userId, {time: now + HORSE, channel: channel, user: {mention: user.toString(), username: user.username}})
                                
                                if(!this.horse.has(member.user.id) || force){
                                    if(member.user.id == "620152697450135552") {
                                        message.channel.send('You cannot mention a GOD.')
                                        return
                                    } 
                                    this.addTimer(member.user.id, "horse", now + HORSE, channel_id, member.user)
                                    this.horse.set(member.user.id, {time: now + HORSE, channel: channel, user: {mention: member.user.toString(), username: member.user.username}})
                                }
                            }
                        }
                    }
                    
                    if(args[1] == "race"){
                        if(!this.horse.has(userId) || force){
                            this.addTimer(userId, "horse", now + HORSE, channel_id, user)
                            this.horse.set(userId, {time: now + HORSE, channel: channel, user: {mention: user.toString(), username: user.username}})
                        }
                    }
                }
            }

            if(sc == "guild"){
                if(args[1]){
                    if(args[1] == "raid" || args[1] == "upgrade"){
                        if(!this.guild.has(channel.guild.id) || force){
                            this.addTimer(channel.guild.id, "guild", now + GUILD, channel_id, user)
                            this.guild.set(channel.guild.id, {time: now + GUILD, channel: channel})
                        }
                    }
                }
            }

            if(sc == "hunt"){
                if(!this.hunt.has(userId) || force){
                    this.hunt.set(userId, {time: now + HUNT, channel: channel, user: {mention: user.toString(), username: user.username}})
                }
            }

            if(sc == "adv" || sc == "adventure"){
                if(!this.adventure.has(userId) || force){
                    this.addTimer(userId, "adventure", now + ADVENTURE, channel_id, user)
                    this.adventure.set(userId, {time: now + ADVENTURE, channel: channel, user: {mention: user.toString(), username: user.username}})
                }
            }

            if(sc == "training" || sc == "tr" ||
               sc == "ultraining" || sc == "ultr"){
                if(!this.training.has(userId) || force){
                    this.addTimer(userId, "training", now + TRAINING, channel_id, user)
                    this.training.set(userId, {time: now + TRAINING, channel: channel, user: {mention: user.toString(), username: user.username}})
                }
            }
            
            if(sc == "miniboss"){
                if(!this.miniboss.has(userId) || force){
                    this.addTimer(userId, "miniboss", now + MINIBOSS, channel_id, user)
                    this.miniboss.set(userId, {time: now + MINIBOSS, channel: channel, user: {mention: user.toString(), username: user.username}})
                    
                    if(!message.mentions.users.first()) return
                    var member = message.guild.members.cache.get(message.mentions.users.first()!.id);
                
                    if(member){
                        if(member.user.id == "620152697450135552") {
                            message.channel.send('You cannot mention a GOD.')
                            return
                        } 
                        this.addTimer(member.user.id, "miniboss", now + MINIBOSS, channel_id, member.user)
                        this.miniboss.set(member.user.id, {time: now + MINIBOSS, channel: channel, user: {mention: member.user.toString(), username: member.user.username}})
                    }
                }
            }

            if(sc == "farm"){
                if(!this.farm.has(userId) || force){
                    this.addTimer(userId, "farm", now + FARM, channel_id, user)
                    this.farm.set(userId, {time: now + FARM, channel: channel, user: {mention: user.toString(), username: user.username}})
                }
            }
            
            if(sc == "arena"){
                if(!this.arena.has(userId) || force){
                    this.addTimer(userId, "arena", now + ARENA, channel_id, user)
                    this.arena.set(userId, {time: now + ARENA, channel: channel, user: {mention: user.toString(), username: user.username}})
                    
                    if(!message.mentions.users.first()) return
                    var member = message.guild.members.cache.get(message.mentions.users.first()!.id);
                    
                    if(member){
                        if(member.user.id == "620152697450135552") {
                            message.channel.send('You cannot mention a GOD.')
                            return
                        }
                        this.addTimer(member.user.id, "arena", now + ARENA, channel_id, member.user)
                        this.arena.set(member.user.id, {time: now + ARENA, channel: channel, user: {mention: member.user.toString(), username: member.user.username}})
                    }
                }
            }

            if(sc == "chop" || sc == "fish" ||
               sc == "axe" || sc == "net" ||
               sc == "pickup" || sc == "ladder" ||
               sc == "mine" || sc == "bowsaw" ||
               sc == "boat" || sc == "pickaxe" ||
               sc == "tractor" || sc == "chainsaw" ||
               sc == "bigboat" || sc == "drill" ||
               sc == "greenhouse" || sc == "dynamite"){
                if(!this.progress.has(userId) || force){
                    this.addTimer(userId, "progress", now + PROGRESS, channel_id, user)
                    this.progress.set(userId, {time: now + PROGRESS, channel: channel, user: {mention: user.toString(), username: user.username}})
                }
            }
        }
    }
    
    run(){
        this.client.on('messageCreate', message => {
            if(message.author.bot) return;
            
            if(message.content.toLowerCase().startsWith('rpg')){
                if(this.client.devMode){
                    this.execute(message)
                }
            }
        })
        
        this.getAllTimers((err: boolean, timers: object[]) => {
            var now = new Date().getTime();
            var removeList: string[] = [];
            
            timers.forEach((data: any) => {
                var userId = data.user_id;
                var type = data.type;
                var time = data.time;
                var channel = <TextChannel>this.client.channels.cache.get(data.channel_id)
                var user = {mention: data.mention, username: data.username}
                
                if((time - now) >= 0){
                    if(type == "adventure"){
                        this.adventure.set(userId, {time: time, channel: channel, user: user})
                    }
                    if(type == "training"){
                        this.training.set(userId, {time: time, channel: channel, user: user})
                    }
                    if(type == "progress"){
                        this.progress.set(userId, {time: time, channel: channel, user: user})
                    }
                    if(type == "farm"){
                        this.farm.set(userId, {time: time, channel: channel, user: user})
                    }
                    if(type == "guild"){
                        this.guild.set(userId, {time: time, channel: channel, user: user})
                    }
                    if(type == "lootbox"){
                        this.lootbox.set(userId, {time: time, channel: channel, user: user})
                    }
                    if(type == "miniboss"){
                        this.miniboss.set(userId, {time: time, channel: channel, user: user})
                    }
                    if(type == "horse"){
                        this.horse.set(userId, {time: time, channel: channel, user: user})
                    }
                    if(type == "arena"){
                        this.arena.set(userId, {time: time, channel: channel, user: user})
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
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user!.mention +', Lootbox ready!')
                this.lootbox.delete(id)
                this.removeTimer(id, "lootbox")
            }
        })
        
        this.guild.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var role = channel.guild.roles.cache.find(r => r.name.toLowerCase() == "rpg");
                
                channel.send(role!.toString() +', Guild Raid/Upgrade')
                this.guild.delete(id)
                this.removeTimer(id, "guild")
            }
        })
        
        this.hunt.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send('**'+ user!.username +'**, Hunt Ready!')
                this.hunt.delete(id)
            }
        })
        
        this.adventure.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send('**'+ user!.mention +'**, Adventure Ready!')
                this.adventure.delete(id)
                this.removeTimer(id, "adventure")
            }
        })
        
        this.training.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send('**'+ user!.username +'**, Training Ready!')
                this.training.delete(id)
                this.removeTimer(id, "training")
            }
        })
        
        this.progress.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send('**'+ user!.username +'**, Progress Ready!')
                this.progress.delete(id)
                this.removeTimer(id, "progress")
            }
        })

        this.farm.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send('**'+ user!.username +'**, Farm Ready!')
                this.farm.delete(id)
                this.removeTimer(id, "farm")
            }
        })
        
        this.miniboss.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user!.mention +', Miniboss Ready!')
                this.miniboss.delete(id)
                this.removeTimer(id, "miniboss")
            }
        })
        
        this.horse.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user!.mention +', Horse Breed/Race Ready!')
                this.horse.delete(id)
                this.removeTimer(id, "horse")
            }
        })
        
        this.arena.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            var user = value.user;
            
            if((time - now) <= 0){
                channel.send(user!.mention +', Arena Ready!')
                this.arena.delete(id)
                this.removeTimer(id, "arena")
            }
        })
    }
    
    /*
    * Database
    */
    
    addTimer(userId: string, type: string, time: number, channelId: string, user: User, callback = (err: boolean, response: object) => {}){
        Timer.collection.findOneAndUpdate({user_id: userId, type: type, channel_id: channelId, username: user.username, mention: user.toString()}, {$set: {time: time}}, {upsert: true}, err => {
            if(err){
                this.client.logger.error(String(err))
                callback(true, {message: 'Failed to add new timer.'})
                return
            }
            callback(false, {message: 'Successfully added to database.'})
        })
    }
    
    removeMany(options: any[], callback = (err: boolean, response: object) => {}){
        Timer.collection.deleteMany({
            _id: {
                $in: options
            }
        }, (err: any) => {
            if(err){
                this.client.logger.error(err);
                callback(true, {message: 'Failed to remove many timer.'})
                return
            }
            callback(false, {message: 'Successfully removed many timer.'})
        })
    }
    
    removeTimer(userId: string, type: string, callback = (err: boolean, response: object) => {}){
        Timer.collection.findOneAndDelete({user_id: userId, type: type}, err => {
            if(err){
                this.client.logger.error(String(err))
                callback(true, {message: 'Failed to remove timer.'})
                return
            }
            callback(false, {message: 'Successfully added to database.'})
        })
    }
    
    async getAllTimers(callback = (err: boolean, response: object[]) => {}){
        const cursor = Timer.collection.find({})
        const array = await cursor.toArray()
        callback(false, array)
    }
}

export default RPGManager
