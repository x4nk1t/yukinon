import { Message, MessageEmbedOptions } from "discord.js";
import CommandManager from "../../CommandManager";

import Command from '../Command';

class Emojis extends Command{
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "emojis",
            description: "Returns emoji list of this server.",
            aliases: ['emjs']
        });
    }

    execute(message: Message, commandArgs: string[]){
        var embed: MessageEmbedOptions = {color: 'BLUE', footer: {text: `Requested by ${message.author.username}`, icon_url: message.author.displayAvatarURL()}};
        const guild = message.guild!;

        if(guild.emojis.cache.size){
            var animated: string[] = [];
            var normal: string[] = [];
            
            guild.emojis.cache.forEach(emoji => {
                if(emoji.animated) animated.push(emoji.toString()); else normal.push(emoji.toString());
            });

            embed.title = guild.name + '\'s Emojis'

            var description = '**Static Emojis** '
            embed.fields = [];
            
            if(normal.length){
                description += '('+ normal.length +') \n'+ normal.join(' ')
            } else {
                description += '\n N/A'
            }

            description += '\n\n **Animated Emojis** '

            if(animated.length){
                description += '('+ animated.length +') \n'+ animated.join(' ');
            }  else {
                description += '\n N/A'
            }

            embed.description = description;

            message.channel.send({embeds: [embed]})
        } else {
            embed.description = 'This guild doesn\'t have any emojis.';
            message.channel.send({embeds: [embed]})
        }
    }
}

export default Emojis
