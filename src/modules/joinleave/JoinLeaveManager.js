const Discord = require('discord.js')
const JoinLeave = require('./models/joinleave.js')
const JoinLeaveCommand = require('./cmds/join-leave.js')

class JoinLeaveManager {
    constructor(client){
        this.client = client;

        this.joinLeaveChannels = new Discord.Collection();

        this.cmdManager = this.client.commandManager;
        this.loadCommands()
        this.run()

        this.registerEvents()
    }

    loadCommands(){
        this.cmdManager.loadCommand(new JoinLeaveCommand(this.cmdManager))
    }

    async run(){
        await this.getJoinLeave().then(datas => {
            datas.forEach(data => {
                this.joinLeaveChannels.set(data.guild_id, data)
            })
        })
    }

    getJoinLeave(){
        return new Promise((resolve, reject) => {
            JoinLeave.collection.find({}, async (err, joinleave) => {
                if(err){
                    this.client.logger.error(err)
                    reject(err)
                    return
                }
                const array = await joinleave.toArray()
                resolve(array)
            })
        })
    }

    addGuildChannel(guild_id, channel_id){
        return new Promise((resolve, reject) => {
            JoinLeave.collection.findOneAndUpdate({guild_id: guild_id}, {$set: {guild_id: guild_id, channel_id: channel_id}}, {upsert: true}, err => {
                if(err){
                    this.client.logger.error(err)
                    reject(err)
                    return
                }
                resolve(true)
            })
        })
    }

    removeGuildChannel(guild_id){
        return new Promise((resolve, reject) => {
            JoinLeave.collection.deleteOne({guild_id: guild_id}, err => {
                if(err){
                    this.client.logger.error(err)
                    reject(err)
                    return
                }
                resolve(true)
            })
        })
    }

    registerEvents(){
        this.client.on('guildMemberAdd', async member => {
            const joinLeave = this.joinLeaveChannels.get(member.guild.id);
            if(joinLeave){
                const user = member.user;
                const messageChannel = await this.client.channels.fetch(joinLeave.channel_id);
                const content = `Welcome ${user.toString()} to the server! \n Have a look around and enjoy your stay here!`
                
                if(messageChannel) messageChannel.send(content)
            }
        })

        this.client.on('guildMemberRemove', async member => {
            const joinLeave = this.joinLeaveChannels.get(member.guild.id);
            if(joinLeave){
                const user = member.user;
                const messageChannel = await this.client.channels.fetch(joinLeave.channel_id);
                const content = `${user.toString()} left the server! \n Hope you enjoyed your stay here!`
                
                if(messageChannel) messageChannel.send(content)
            }
        })
    }
}

module.exports = JoinLeaveManager