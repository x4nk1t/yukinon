const { MessageManager, Message } = require('discord.js');
const Command = require('../../../utils/Command.js');

class JoinLeaveCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "join-leave",
            description: "Set join/leave channels",
            usage: "<add|remove> [channel]",
            aliases: ['jl']
        });
    }
    
    execute(message, commandArgs){
        const manager = this.client.joinLeaveManager;
        const guild = message.guild;
        const joinLeave = manager.joinLeaveChannels.get(guild.id);

        if(!message.member.hasPermission('MANAGE_GUILD')){
            message.channel.send(this.embed('You don\'t have permission to use this command!'))
            return
        }
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                if(joinLeave && joinLeave.channel_id){
                    message.channel.send(this.embed('This guild already has the join leave channel.'))
                    return
                }

                const mention = message.mentions.channels.first();
                
                if(mention.toString() == commandArgs[1]){
                    const id = mention.id;
                    manager.joinLeaveChannels.set(guild.id, {guild_id: guild.id, channel_id: id})
                    manager.addGuildChannel(guild.id, id)
                    message.channel.send(this.embed('Added this guild join leave message channel.'))
                    return
                }
            }

            if(commandArgs[0] == "remove"){
                if(joinLeave && joinLeave.channel_id){
                    manager.joinLeaveChannels.delete(guild.id)
                    manager.removeGuildChannel(guild.id)
                    message.channel.send(this.embed('Removed this guild join leave message channel.'))
                }
                
                message.channel.send(this.embed('This guild does not have join leave channel.'))
                return
            }
        }
        this.sendUsage(message)
    }

    embed(message){
        return {embed: {
            color: 'BLUE',
            description: message
        }}
    }
}

module.exports = JoinLeaveCommand