const Discord = require('discord.js')

class RPGReminder {
    constructor(client){
        this.client = client;
        
        this.hunt = new Discord.Collection();
        this.adventure = new Discord.Collection();
        this.progress = new Discord.Collection();
        this.training = new Discord.Collection();
    }
    
    execute(message){
        var args = message.content.split(' ')
        args.shift()
        var now = new Date().getTime()
        var sc = args[0]
        
        if(sc == "hunt"){
            if(!this.hunt.has(message.author.id)){
                this.hunt.set(message.author.id, {time: now + 60000, message: message}) //1min
            }
        }
        
        if(sc == "adv" || sc == "adventure"){
            if(!this.adventure.has(message.author.id)){
                this.adventure.set(message.author.id, {time: now + 3600000, message: message}) //1hr
            }
        }
        
        if(sc == "training"){
            if(!this.training.has(message.author.id)){
                this.training.set(message.author.id, {time: now + 900000, message: message}) //15min
            }
        }
        
        if(sc == "chop" || sc == "fish" ||
           sc == "axe" || sc == "net" ||
           sc == "pickup" || sc == "ladder" ||
           sc == "mine" || sc == "bowsaw" ||
           sc == "boat" || sc == "pickaxe"){
            if(!this.progress.has(message.author.id)){
                this.progress.set(message.author.id, {time: now + 300000, message: message}) //5min
            }
        }
    }
    
    run(){
        setInterval(() => this.checkReminders(), 1000)
    }
    
    checkReminders(){
        var huntArray = Array.from(this.hunt.values())
        var adventureArray = Array.from(this.adventure.values())
        var progressArray = Array.from(this.progress.values())
        var now = new Date().getTime()
        
        huntArray.forEach((value, key) => {
            var id = key;
            var time = value.time;
            var message = value.message;
            
            if((time - now) <= 0){
                message.channel.send('Hunt Ready! <@'+id+'>').then(() => {
                    this.hunt.delete(id)
                })
            }
        })
        
        adventureArray.forEach((value, key) => {
            var id = key;
            var time = value.time;
            var message = value.message;
            
            if((time - now) <= 0){
                message.channel.send('Adventure Ready! <@'+id+'>').then(() => {
                    this.adventure.delete(id)
                })
            }
        })
        
        progressArray.forEach((value, key) => {
            var id = key;
            var time = value.time;
            var message = value.message;
            
            if((time - now) <= 0){
                message.channel.send('Progress Ready! <@'+id+'>').then(() => {
                    this.progress.delete(id)
                })
            }
        })
    }
}

module.exports = RPGReminder
