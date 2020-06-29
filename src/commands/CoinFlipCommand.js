const discord = require('discord.js');
const EmbedBuilder = require('../utils/EmbedBuilder.js');
const Command = require('./Command.js');

class CoinFlipCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, "coinflip", "Flips the coin and shows head/tail.", "[head|tail]");
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var embed = new EmbedBuilder().build()
            .setTitle("CoinFlip")
        
        if(commandArgs[0]){
            var ht = commandArgs[0].toLowerCase();
            
            if(ht != 'head' && ht != 'tail') {
                embed.setDescription('**Usage:** ' + this.usage)
                message.channel.stopTyping()
                message.channel.send(embed)
                return;
            }
            
            var flip = this.flip()
            message.channel.send(embed.setDescription('Flipping coin....')).then(sent => {
                setTimeout(() => {
                    if(flip == ht){
                        embed.setColor('#00FF00').setDescription('Its a **'+ flip +'**. You Won!')
                    } else {
                        embed.setColor('#FF0000').setDescription('Its a **'+ flip +'**. You Lost!')
                    }
                    message.channel.stopTyping()
                    sent.edit(embed)
                }, 1300)
            })
        } else {
            
            message.channel.send(embed.setDescription('Flipping coin...')).then(sent => {
                embed.setDescription('Its a **'+ this.flip() +'**.')
                
                setTimeout(() => {                
                    message.channel.stopTyping()
                    sent.edit(embed)
                }, 1300)
            })
        }
    }
    
    flip(){
        const rand = Math.round(Math.random())
        
        return (rand == 0) ? "head" : "tail";
    }
}

module.exports = CoinFlipCommand;