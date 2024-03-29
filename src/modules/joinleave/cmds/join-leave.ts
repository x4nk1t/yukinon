import { Message, MessageEmbed, MessageEmbedOptions, MessageOptions } from 'discord.js';
import CommandManager from '../../../CommandManager';
import Command from '../../../utils/Command';
import JoinLeaveManager from '../JoinLeaveManager';

class JoinLeaveCommand extends Command{
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "join-leave",
            description: "Set join/leave channels",
            usage: "<add|remove> [channel]",
            aliases: ['jl'],
            permissions: ['MANAGE_GUILD']
        });
    }
    
    execute(message: Message, commandArgs: string[]){
        const manager: JoinLeaveManager = this.client.joinLeaveManager!;
        const guild = message.guild!;
        const joinLeave = manager.joinLeaveChannels.get(guild.id);

        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                if(joinLeave && joinLeave.channel_id){
                    message.channel.send(this.embed('This guild already has the join leave channel.'))
                    return
                }

                const mention = message.mentions.channels.first()!;
                
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
                    return
                }
                
                message.channel.send(this.embed('This guild does not have join leave channel.'))
                return
            }
        }
        this.sendUsage(message)
    }

    embed(message: string): MessageOptions{
        let embed: MessageOptions = {embeds:
                [{
                color: 'BLUE',
                description: message
            }]
        };
        return embed;
    }
}

export default JoinLeaveCommand