const Discord = require('discord.js')

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

            if(message.channel.name != "rpg"){
                return;
            }
            
            if(sc == "buy"){
                if(args[1] && args[2])
                    if(args[2] == "lootbox"){
                        if(!this.lootbox.has(message.author.id) || force){
                            this.lootbox.set(message.author.id, {time: now + 10800000, message: message}) //3hr
                        }
                    }
                }
            }

            if(sc == "guild"){
                if(args[1]){
                    if(args[1] == "raid" || args[1] == "upgrade"){
                        if(!this.guild.has(message.guild.id) || force){
                            this.guild.set(message.guild.id, {time: now + 7200000, message: message}) //2hr
                        }
                    }
                }
            }

            if(sc == "hunt"){
                if(!this.hunt.has(message.author.id) || force){
                    this.hunt.set(message.author.id, {time: now + 60000, message: message}) //1min
                }
            }

            if(sc == "adv" || sc == "adventure"){
                if(!this.adventure.has(message.author.id) || force){
                    this.adventure.set(message.author.id, {time: now + 3600000, message: message}) //1hr
                }
            }

            if(sc == "training"){
                if(!this.training.has(message.author.id) || force){
                    this.training.set(message.author.id, {time: now + 900000, message: message}) //15min
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
                    this.progress.set(message.author.id, {time: now + 300000, message: message}) //5min
                }
            }
        }
    }
    
    run(){
        setInterval(() => this.checkReminders(), 1000)
    }
    
    checkReminders(){
        var now = new Date().getTime()
        
        this.lootbox.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var message = value.message;
            
            if((time - now) <= 0){
                message.channel.send(message.author.toString() +', Lootbox ready! ')
                this.hunt.delete(id)
            }
        })
        
        this.guild.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var message = value.message;
            
            if((time - now) <= 0){
                var role = message.guild.roles.cache.find(r => r.name.toLowerCase() == "role play");
                var wtd = (new Date().getDay()) < 5 ? "Upgrade" : "Raid"; 
                
                message.channel.send(role.toString() +' Guild '+ wtd +' (Preferred)!')
                this.guild.delete(id)
            }
        })
        
        this.hunt.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var message = value.message;
            
            if((time - now) <= 0){
                message.channel.send(message.author.username +', Hunt Ready! ')
                this.hunt.delete(id)
            }
        })
        
        this.adventure.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var message = value.message;
            
            if((time - now) <= 0){
                message.channel.send(message.author.username +', Adventure Ready! ')
                this.adventure.delete(id)
            }
        })
        
        this.training.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var message = value.message;
            
            if((time - now) <= 0){
                message.channel.send(message.author.username +', Training Ready! ')
                this.training.delete(id)
            }
        })
        
        this.progress.forEach((value, key, map) => {
            var id = key;
            var time = value.time;
            var message = value.message;
            
            if((time - now) <= 0){
                message.channel.send(message.author.username +', Progress Ready! ')
                this.progress.delete(id)
            }
        })
    }
}

module.exports = RPGReminder
