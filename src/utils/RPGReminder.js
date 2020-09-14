const Discord = require('discord.js')

class RPGReminder {
    constructor(client){
        this.client = client;
        
        this.hunt = new Discord.Collection();
        this.adventure = new Discord.Collection();
        this.progress = new Discord.Collection();
        this.training = new Discord.Collection();
        this.guild = new Discord.Collection();
    }
    
    execute(message){
        var args = message.content.split(' ')
        args.shift()
        var now = new Date().getTime()
        var id = message.author.id;
        var channelId = message.channel.id;
        var channel = message.channel;
        
        if(args[0]){
            var sc = args[0].toLowerCase()

            if(channel.name != "rpg"){
                return;
            }

            if(sc == "guild"){
                if(args[1]){
                    if(args[1] == "raid" || args[1] == "upgrade"){
                        if(!this.guild.has(message.guild.id)){
                            this.client.dbapi.addTimer(message.guild.id, "guild", now + 7200000, channelId)
                            this.guild.set(message.guild.id, {time: now + 7200000, channel: channel}) //2hr
                        }
                    }
                }
            }

            if(sc == "hunt"){
                if(!this.hunt.has(id)){
                    this.hunt.set(id, {time: now + 60000, channel: channel}) //1min
                }
            }

            if(sc == "adv" || sc == "adventure"){
                if(!this.adventure.has(id)){
                    this.client.dbapi.addTimer(id, "adventure", now + 3600000, channelId)
                    this.adventure.set(id, {time: now + 3600000, channel: channel}) //1hr
                }
            }

            if(sc == "training"){
                if(!this.training.has(id)){
                    this.client.dbapi.addTimer(id, "training", now + 900000, channelId)
                    this.training.set(id, {time: now + 900000, channel: channel}) //15min
                }
            }

            if(sc == "chop" || sc == "fish" ||
               sc == "axe" || sc == "net" ||
               sc == "pickup" || sc == "ladder" ||
               sc == "mine" || sc == "bowsaw" ||
               sc == "boat" || sc == "pickaxe"){
                if(!this.progress.has(id)){
                    this.progress.set(id, {time: now + 300000, channel: channel}) //5min
                }
            }
        }
    }
    
    run(){
        var now = new Date().getTime()
        
        this.client.dbapi.getAllTimers((err, d) => {
            if(err){
                this.client.logger.error(d.message)
                return
            }
            for(var i = 0; i < data.length; i++){
                var userId = data[i].user_id;
                var type = data[i].type;
                var time = data[i].time;
                var channelId = data[i].channel_id;
                
                if((time - now) < 0){
                    data.splice(i, 1)
                    this.client.dbapi.removeTimer(userId, type)
                } else {
                    var channel = this.client.channels.cache.get(channelId)
                    if(type == "guild"){
                        this.guild.set(userId, {time: time, channel: channel})
                    }
                    if(type == "adventure"){
                        this.adventure.set(userId, {time: time, channel: channel})
                    }
                    if(type == "training"){
                        this.training.set(userId, {time: time, channel: channel})
                    }
                }
            }
        })
    }
    
    checkReminders(){
        var now = new Date().getTime()
        
        this.guild.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var role = channel.guild.roles.cache.find(r => r.name.toLowerCase() == "role play");
                var wtd = (new Date().getDay()) < 5 ? "Upgrade" : "Raid"; 
                
                channel.send(role.toString() +' Guild '+ wtd +' (Preferred)!')
                this.guild.delete(id)
                this.client.dpapi.removeTimer(id, 'guild')
            }
        })
        
        this.hunt.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                //var user = this.client.users.cache.get(id)
                channel.send('<@'+id+'>, Hunt Ready! ')
                this.hunt.delete(id)
            }
        })
        
        this.adventure.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.cache.get(id)
                channel.send(user.username +', Adventure Ready! ')
                this.adventure.delete(id)
                this.client.dpapi.removeTimer(id, 'adventure')
            }
        })
        
        this.training.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.cache.get(id)
                channel.send(user.username +', Training Ready! ')
                this.training.delete(id)
                this.client.dpapi.removeTimer(id, 'training')
            }
        })
        
        this.progress.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var channel = value.channel;
            
            if((time - now) <= 0){
                var user = this.client.users.cache.get(id)
                channel.send(user.username +', Progress Ready! ')
                this.progress.delete(id)
            }
        })
    }
}

module.exports = RPGReminder
