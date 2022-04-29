import { Message, MessageEmbedOptions, Snowflake } from 'discord.js';
import CommandManager from '../../../CommandManager';
import Command from '../../../utils/Command';

class Coinflip extends Command{
    coinEmojiId: Snowflake;

    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "coinflip",
            description: "Flip a coin.",
            usage: "[head|tail]",
            aliases: ['coin', 'cf']
        });

        this.coinEmojiId = "969584520024178708";
    }
    
    execute(message: Message, commandArgs: string[]){        
        var embed: MessageEmbedOptions = {
            title: 'Coin flip',
            color: 'BLUE'
        }
        
        if(commandArgs[0]){
            var ht = commandArgs[0].toLowerCase();
            if(ht == 'h') ht = 'head';
            if(ht == 't') ht = 'tail';
            
            if(ht != 'head' && ht != 'tail') {
                this.sendUsage(message)
                return;
            }
            
            var flip = this.flip()
            embed.image = {url: this.client.emojis.resolve(this.coinEmojiId)?.url};
            message.channel.send({embeds: [embed]}).then((sent: Message) => {
                embed.image = {}
                if(flip == ht){
                    embed.color = 'GREEN'
                    embed.description = 'Its a **'+ flip +'**. You Won!'
                    embed.footer = {text: 'Coin flipped by '+ message.author.username}
                } else {
                    embed.color = 'RED'
                    embed.description = 'Its a **'+ flip +'**. You Lost!'
                    embed.footer = {text: 'Coin flipped by '+ message.author.username}
                }

                setTimeout(() => {
                    sent.edit({embeds: [embed]})
                }, 1500)
            })
        } else {
            embed.image = {url: this.client.emojis.resolve(this.coinEmojiId)?.url};
            message.channel.send({embeds: [embed]}).then((sent: Message) => {
                embed.color = 'BLUE'
                embed.description = 'Its a **'+ this.flip() +'**.'
                embed.footer = {text: 'Coin flipped by '+ message.author.username}
                embed.image = {}
                
                setTimeout(() => {
                    sent.edit({embeds: [embed]})
                }, 1500)
            })
        }
    }
    
    flip(){
        const rand = Math.round(Math.random())
        
        return (rand == 0) ? "head" : "tail";
    }
}

export default Coinflip;
