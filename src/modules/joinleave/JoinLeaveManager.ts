import Client from "../../Client";

import Discord, { Collection, Snowflake, TextChannel } from 'discord.js';
import JoinLeave from './models/joinleave';
import JoinLeaveCommand from './cmds/join-leave';
import CommandManager from "../../CommandManager";

class JoinLeaveManager {
    client: Client;
    joinLeaveChannels: Collection<Snowflake, {guild_id: Snowflake, channel_id: Snowflake}>;
    commandManager: CommandManager;

    constructor(client: Client){
        this.client = client;

        this.joinLeaveChannels = new Discord.Collection();

        this.commandManager = this.client.commandManager;
        this.loadCommands()
        this.run()

        this.registerEvents()
    }

    loadCommands(){
        this.commandManager.loadCommand(new JoinLeaveCommand(this.commandManager))
    }

    async run(){
        await this.getJoinLeave().then((datas: any) => {
            datas.forEach((data: {guild_id: Snowflake, channel_id: Snowflake}) => {
                this.joinLeaveChannels.set(data.guild_id, data)
            })
        })
    }

    getJoinLeave(){
        return new Promise((resolve, reject) => {
            const cursor = JoinLeave.collection.find({});
            resolve(cursor.toArray());
        })
    }

    addGuildChannel(guild_id: Snowflake, channel_id: Snowflake){
        return new Promise((resolve, reject) => {
            JoinLeave.collection.findOneAndUpdate({guild_id: guild_id}, {$set: {guild_id: guild_id, channel_id: channel_id}}, {upsert: true}, err => {
                if(err){
                    this.client.logger.error(String(err));
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }

    removeGuildChannel(guild_id: Snowflake){
        return new Promise((resolve, reject) => {
            JoinLeave.collection.deleteOne({guild_id: guild_id}, err => {
                if(err){
                    this.client.logger.error(String(err));
                    reject(err);
                    return;
                }
                resolve(true);
            })
        })
    }

    registerEvents(){
        this.client.on('guildMemberAdd', async member => {
            const joinLeave = this.joinLeaveChannels.get(member.guild.id);
            if(joinLeave){
                const user = member.user;
                const messageChannel = await this.client.channels.fetch(joinLeave.channel_id);
                const content = `Welcome ${user.toString()} to the server! \nHave a look around and enjoy your stay here!`
                
                if(messageChannel) (messageChannel as TextChannel).send(content)
            }
        })

        this.client.on('guildMemberRemove', async member => {
            const joinLeave = this.joinLeaveChannels.get(member.guild.id);
            if(joinLeave){
                const user = member.user;
                const messageChannel = await this.client.channels.fetch(joinLeave.channel_id);
                const content = `${user.toString()} left the server! \nHope you enjoyed your stay here!`
                
                if(messageChannel) (messageChannel as TextChannel).send(content)
            }
        })
    }
}

export default JoinLeaveManager;