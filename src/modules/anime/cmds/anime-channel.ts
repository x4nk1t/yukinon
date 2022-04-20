import { Message, MessageEmbedOptions } from 'discord.js';
import CommandManager from '../../../CommandManager';
import Command from '../../../utils/Command';

class AnimeChannel extends Command{
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "anime-channel",
            description: "Get releases in a channel.",
            usage: "<add|remove>",
            aliases: ['channel'],
            permissions: ['MANAGE_CHANNELS']
        });
    }
    
    async execute(message: Message, commandArgs: string[]){
        var channel = message.channel;
        var embed: MessageEmbedOptions = {color: 'BLUE'}
        if(commandArgs[0]){
            if(commandArgs[0] == 'add' || commandArgs[0] == 'remove'){
                if(commandArgs[0] == 'remove'){
                    if(this.isAnimeChannel(channel.id)){
                        await this.client.animeManager!.removeAnimeChannel(channel.id);
                        this.client.animeManager!.animeChannels.some((ch, index) => {
                            if(ch.channel_id == channel.id){
                                this.client.animeManager!.animeChannels.splice(index, 1)
                                return
                            }
                        })
                        embed.description = 'Successfully removed '+ channel.toString() + '.';
                        
                        message.channel.send({embeds: [embed]})
                    } else {
                        embed.description = ((channel.id == message.channel.id) ? 'This' : channel.toString()) +' is not an anime channel.';
                        message.channel.send({embeds: [embed]})
                    }
                } else {
                    if(!this.isAnimeChannel(channel.id)){                    
                        await this.client.animeManager!.addAnimeChannel(channel.id);
                        this.client.animeManager!.animeChannels.push({channel_id: channel.id, tracking: [], last_updated: new Date().getTime()})
                        embed.description = 'Successfully added '+ channel.toString() + '.';
                        
                        message.channel.send({embeds: [embed]})
                    } else {
                        embed.description = ((channel.id == message.channel.id) ? 'This' : channel.toString()) +' is already an anime channel. You don\'t have to do it twice.';
                        message.channel.send({embeds: [embed]})
                    }
                }
                return
            }
        } else {
            if(this.isAnimeChannel(channel.id)){
                embed.description = 'This is an anime channel.';
            } else {
                embed.description = 'This is not an anime channel';
            }
            message.channel.send({embeds: [embed]})
        }
    }
    
    isAnimeChannel(channel_id: string){
        var found = false;
        this.client.animeManager!.animeChannels.forEach(channel => {
            if(channel_id == channel.channel_id){
                found = true
                return
            }
        })
        return found
    }
}

export default AnimeChannel;
