const Discord = require('discord.js');
const axios = require('axios')

const User = require('./cmds/user.js')

class SMMOManager {
    constructor(client){
        this.client = client;
        this.api_key = process.env.SMMO_API;
        this.cmdManager = client.commandManager;

        this.worldboss = [];

        this.loadCommands()
    }

    loadCommands(){
        this.cmdManager.loadCommand(new User(this.cmdManager))
    }
    
    async run(){
        await this.getBossDetails().then(details => {this.worldboss = details;}).catch(console.error)
        
        if(this.worldboss.length) this.setTimeouts(); else setTimeout(() => {this.run()}, 600000) //Check again in 10 minutes
    }

    setTimeouts(){
        this.worldboss.forEach(boss => {
            const time = boss.enable_time * 1000;
            const now = new Date().getTime()
            const diff = time - now;
            const first_timeout = diff - 600000;
            const second_timeout = diff - 60000;

            if(diff > 0){
                if(diff > 600000){
                    setTimeout(() => { this.sendBoss(boss, '10 minutes') }, first_timeout)
                }
                if(diff > 60000){
                    setTimeout(() => { this.sendBoss(boss, '1 minute') }, second_timeout)
                }
            }
        })
    }

    sendBoss(boss, minutes){
        this.client.guilds.cache.each(guild => {
            const channel = guild.channels.cache.find(channel => channel.name.toString() == 'smmo');
            if(channel){
                const role = guild.roles.cache.find(role => role.name.toLowerCase() == 'wb ping')
                var mention = ''
                if(role) mention = '['+ role.toString() +']'
                const embed = {color: 'BLUE'}
                embed.title = boss.name;
                embed.url = 'https://web.simple-mmo.com/worldboss/view/'+ boss.id
                embed.description = 'Click the name to go to world boss page.'
                embed.fields = [{name: 'Level', value: boss.level, inline: true}, {name: 'HP', value: boss.max_hp, inline: true}]

                this.worldboss.splice(this.worldboss.indexOf(boss), 1)
                
                channel.send({content: `${mention} WB **${boss.name}** in ${minutes}!`, embed: embed})
            }
        })
    }

    formatTime(date_in_ms){
        var delta = Math.abs(date_in_ms);

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        
        var seconds = Math.round(delta % 60);
        
        return (days +'d '+ hours +'h '+ minutes + 'm '+ seconds + 's')
    }

    getBossDetails(){
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: 'https://api.simple-mmo.com/v1/worldboss/all',
                data: {api_key: this.api_key}
            }).then(response => { resolve(response.data) }).catch(err => { reject(err)})
        })
    }
}

module.exports = SMMOManager