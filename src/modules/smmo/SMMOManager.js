const Discord = require('discord.js');
const axios = require('axios')

const User = require('./cmds/user.js');
const WorldBosses = require('./cmds/worldbosses.js');
const Link = require('./cmds/link.js');
const Profile = require('./cmds/profile.js');
const Unlink = require('./cmds/unlink.js');

const SMMO = require('./models/smmo.js')

class SMMOManager {
    constructor(client){
        this.client = client;
        this.api_key = process.env.SMMO_API;
        this.cmdManager = client.commandManager;

        this.worldboss = [];
        this.profiles = new Discord.Collection();

        this.loadCommands()
    }

    loadCommands(){
        this.cmdManager.loadCommand(new User(this.cmdManager))
        this.cmdManager.loadCommand(new WorldBosses(this.cmdManager))
        this.cmdManager.loadCommand(new Profile(this.cmdManager))
        this.cmdManager.loadCommand(new Link(this.cmdManager))
        this.cmdManager.loadCommand(new Unlink(this.cmdManager))
    }
    
    async run(){
        await this.getProfiles().then(profiles => {
            profiles.forEach(profile => {
                this.profiles.set(profile.user_id, {_id: profile._id, user_id: profile.user_id, ingame_id: profile.ingame_id})
            })
        }).catch(console.error)
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

    sendRequest(method, url, body = ''){
        return axios({ method: method, url: url, data: {api_key: this.api_key} })
    }

    getBossDetails(){
        return new Promise((resolve, reject) => {
            this.sendRequest('post', 'https://api.simple-mmo.com/v1/worldboss/all')
                .then(response => {
                    resolve(response.data)
                }).catch(err => { reject(err)})
        })
    }

    getProfiles(){
        return new Promise((resolve, reject) => {
            SMMO.collection.find({}, async (err, data) => {
                if(err){
                    reject(err)
                    return
                }
                const profiles = await data.toArray()
                resolve(profiles)
            })
        })
    }
    
    profileEmbed(message, data){
        const profile_number = data.profile_number != null ? "#"+ data.profile_number : '';
        const guild = data.guild ? `[${data.guild.name}](https://web.simple-mmo.com/guilds/view/${data.guild.id})` : 'None';

        const embed = {
            title: data.name + profile_number,
            color: 'BLUE',
            url: 'https://web.simple-mmo.com/user/view/'+ data.id,
            description: `*${data.motto}*\n[[Attack]](https://web.simple-mmo.com/user/attack/${data.id}) [[Message]](https://web.simple-mmo.com/messages/view/user/${data.id}) [[Send Gold]](https://web.simple-mmo.com/sendgold/${data.id}) [[Send Item]](https://web.simple-mmo.com/inventory?sendid=${data.id})`,
            fields: [
                {name: 'Level', value: data.level.toLocaleString(), inline: true},
                {name: 'Gold', value: data.gold.toLocaleString(), inline: true},
                {name: 'Steps', value: data.steps.toLocaleString(), inline: true},
                {name: 'Strength', value: data.str.toLocaleString() + ` (+${data.bonus_str.toLocaleString()})`, inline: true},
                {name: 'Defence', value: data.def.toLocaleString() + ` (+${data.bonus_def.toLocaleString()})`, inline: true},
                {name: 'Dexterity', value: data.dex.toLocaleString() + ` (+${data.bonus_dex.toLocaleString()})`, inline: true},
                {name: 'User Kills', value: data.user_kills.toLocaleString(), inline: true},
                {name: 'NPC Kills', value: data.npc_kills.toLocaleString(), inline: true},
                {name: 'Quests Completed', value: data.quests_complete.toLocaleString(), inline: true},
                {name: 'Safe mode' , value: data.safeMode == 0 ? "No" : "Yes", inline: true},
                {name: 'Guild', value: guild, inline: true},
            ],
            footer: {
                text: 'Requested by '+ message.author.username,
                icon_url: message.author.displayAvatarURL() 
            }
        }
        if(data.safeModeTime){
            embed.fields.push({name: 'Safe Mode Time <:idk:769065058788442112>', value: data.safeModeTime, inline: true})
        }

        return embed;
    }
}

module.exports = SMMOManager