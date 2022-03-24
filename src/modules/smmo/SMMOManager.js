const Discord = require('discord.js');
const axios = require('axios')

const User = require('./cmds/user.js');
const WorldBosses = require('./cmds/worldbosses.js');
const Link = require('./cmds/link.js');
const Profile = require('./cmds/profile.js');
const Unlink = require('./cmds/unlink.js');
const Guild = require('./cmds/guild.js');
const GuildMembers = require('./cmds/guild-members.js');
const ReloadBoss = require('./cmds/reload-boss.js');
const Simulate = require('./cmds/simulate.js');
const FindGold = require('./cmds/find-gold.js');
const MyStats = require('./cmds/my-stats.js');
const SendDaily = require('./cmds/send-daily.js');
const War = require('./cmds/war.js');

const SMMO = require('./models/smmo.js');
const SMMOStats = require("./models/smmo-stats");
const Wars = require("./models/wars");
const Constants = require('./Constants.js');

class SMMOManager {
    constructor(client){
        this.client = client;
        this.api_key = process.env.SMMO_API;
        this.cmdManager = client.commandManager;

        this.worldboss = [];
        this.profiles = new Discord.Collection();
        this.profile_stats = new Discord.Collection();
        this.war_list = new Discord.Collection();

        this.loadCommands()
        this.run()
    }

    loadCommands(){
        //this.cmdManager.loadCommand(new FindGold(this.cmdManager))
        this.cmdManager.loadCommand(new Guild(this.cmdManager))
        this.cmdManager.loadCommand(new GuildMembers(this.cmdManager))
        this.cmdManager.loadCommand(new Link(this.cmdManager))
        this.cmdManager.loadCommand(new Profile(this.cmdManager))
        this.cmdManager.loadCommand(new ReloadBoss(this.cmdManager))
        this.cmdManager.loadCommand(new Simulate(this.cmdManager))
        this.cmdManager.loadCommand(new Unlink(this.cmdManager))
        this.cmdManager.loadCommand(new User(this.cmdManager))
        this.cmdManager.loadCommand(new WorldBosses(this.cmdManager))
        this.cmdManager.loadCommand(new MyStats(this.cmdManager))
        this.cmdManager.loadCommand(new SendDaily(this.cmdManager))
        this.cmdManager.loadCommand(new War(this.cmdManager))
    }
    
    async run(){
        const profiles = await this.getProfiles()
        
        profiles.forEach(profile => {
            this.profiles.set(profile.user_id, profile)
        })

        await this.loadAllBosses()

        const stats = await this.loadStats()

        stats.forEach(stat => {
            this.profile_stats.set(stat.ingame_id, stat)
        })

        this.setRefreshTimeout()
    }

    loadAllBosses(){
        return new Promise(async (resolve, reject) => {
            await this.getBossDetails().then(details => {this.worldboss = details;}).catch(console.error)
        
            if(!this.worldboss.length) {
                setTimeout(() => {this.loadAllBosses()}, 600000) //Check again in 10 minutes
            }
            resolve({error: 0})
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

    sendRequest(method, url){
        return axios({ method: method, url: Constants.API_URL + url, data: {api_key: this.api_key} })
    }

    getBossDetails(){
        return new Promise((resolve, reject) => {
            this.sendRequest('post', '/worldboss/all')
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

        const str = `${data.str.toLocaleString()} (+${data.bonus_str.toLocaleString()})`;
        const def = `${data.def.toLocaleString()} (+${data.bonus_def.toLocaleString()})`;
        const dex = `${data.dex.toLocaleString()} (+${data.bonus_dex.toLocaleString()})`;

        const unused_points = (data.level * 2 + 15) - (data.str + data.def + data.dex);

        const embed = {
            title: data.name + profile_number,
            color: 'BLUE',
            url: 'https://web.simple-mmo.com/user/view/'+ data.id,
            description: `*${data.motto}*\nUnused Stats Points: ${unused_points}\n[Attack](https://web.simple-mmo.com/user/attack/${data.id}) | [Message](https://web.simple-mmo.com/messages/view/user/${data.id}) | [Send Gold](https://web.simple-mmo.com/sendgold/${data.id}) | [Send Item](https://web.simple-mmo.com/inventory?sendid=${data.id}) | ID: ${data.id}`,
            fields: [
                {name: 'Level', value: data.level.toLocaleString(), inline: true},
                {name: 'Gold', value: data.gold.toLocaleString(), inline: true},
                {name: 'Steps', value: data.steps.toLocaleString(), inline: true},
                {name: 'Strength', value: str, inline: true},
                {name: 'Defence', value: def, inline: true},
                {name: 'Dexterity', value: dex, inline: true},
                {name: 'User Kills', value: data.user_kills.toLocaleString(), inline: true},
                {name: 'NPC Kills', value: data.npc_kills.toLocaleString(), inline: true},
                {name: 'Quests Completed', value: data.quests_complete.toLocaleString(), inline: true},
                {name: 'Safe mode' , value: data.safeMode == 0 ? "No" : "Yes", inline: true},
                {name: 'Guild', value: guild, inline: true},
                {name: 'Safe Mode Time', value: data.safeModeTime ? data.safeModeTime : 'Perma safe', inline: true}
            ],
            footer: {
                text: 'Requested by '+ message.author.username,
                icon_url: message.author.displayAvatarURL() 
            }
        }

        return embed;
    }

    /*
    * Daily Stats
    */

    setRefreshTimeout(){
        const now = new Date();
        const time = now.getTime();
        
        var refreshTime = (new Date(new Date().setUTCHours(12,0,0,0))).getTime()

        if(now.getUTCHours() >= 12){
            refreshTime = (new Date(new Date().setUTCHours(36,0,0,0))).getTime()
        }

        const diff = (refreshTime - time)

        setTimeout(async () => {
            await this.updateStats()
            this.setRefreshTimeout()
        }, diff)
    }

    loadStats(){
        return new Promise((resolve, reject) => {
            SMMOStats.collection.find({}, async (err, data) => {
                if(err){
                    reject(err)
                    return
                }
                const array = await data.toArray()
                resolve(array)
            })
        })
    }

    updateStats(){
        return new Promise(async (resolve, reject) => {
            for(const [key, profile] of this.profiles) {
                const user_id = profile.user_id;
                const send_daily = profile.send_daily;
                const id = profile.ingame_id;
                
                const response = await this.sendRequest('post', '/player/info/'+ id).catch(console.log)
                
                if(response.data.error) continue
    
                const {level, steps, npc_kills, user_kills, quests_complete} = response.data;
    
                const details = {
                    ingame_id: id,
                    level: level,
                    steps: steps,
                    npc_kills: npc_kills,
                    user_kills: user_kills,
                    quests_complete: quests_complete,
                    datetime: new Date().getTime()
                }
    
                if(send_daily == 1) {
                    const user = await this.client.users.fetch(user_id)
                    const stats = this.profile_stats.get(id)
    
                    if(stats == null) return
    
                    if(user) {
                        const embed = {
                            color: 'BLUE',
                            url: 'https://web.simple-mmo.com/user/view/'+ id,
                            title: 'Your daily stats',
                            fields: [
                                {name: 'Level', value: level - stats.level, inline: true},
                                {name: 'Steps', value: steps - stats.steps, inline: true},
                                {name: 'NPC Kills', value: npc_kills - stats.npc_kills, inline: true},
                                {name: 'User Kills', value: user_kills - stats.user_kills, inline: true},
                                {name: 'Quests Complete', value: quests_complete - stats.quests_complete, inline: true}
                            ]
                        }
    
                        user.send({embeds: [embed]})
                    }
                }
    
                this.profile_stats.set(id, details)
                await this.updateOne(details).catch(console.log)
            }
            resolve()
        })
    }

    updateOne(details){
        return new Promise((resolve, reject) => {
            SMMOStats.collection.findOneAndUpdate({ingame_id: details.ingame_id}, {$set: details}, {upsert: true}, (err) => {
                if(err){
                    this.client.logger.error('Failed to update smmo stats.')
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }

    updateWar(details){
        return new Promise((resolve, reject) => {
            Wars.collection.findOneAndUpdate({user_id: details.user_id}, {$set: details}, {upsert: true}, (err) => {
                if(err){
                    this.client.logger.error('Failed to update war list.')
                    reject(err)
                    return
                }
                resolve()
            })
        })
    }

    async generateAttackables(guilds_id){
        const attackables = [];
        const manager = this.client.smmoManager;
        
        for(const id of guilds_id){
            await this.sendRequest('post', '/guilds/info/'+ id)
                .then(async response => {
                    const data = response.data;
                    
                    if(data.error == 'guild not found'){
                        return
                    }
                    var members;

                    await this.sendRequest('post', '/guilds/members/'+ id).then(membersResponse => {
                        members = membersResponse.data;
                    })
                    
                    const filtered = members.filter(member => member.safe_mode == 0)

                    filtered.forEach(filter => {
                        if((filter.current_hp / filter.max_hp) >= 0.5) attackables.push(filter)
                    })
                })
        }

        return attackables;
    }
}

module.exports = SMMOManager