const discord = require('discord.js');
const EmbedBuilder = require('../utils/EmbedBuilder.js');

class CoinFlipCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix +"coinflip [heads|tails]";
        this.description = "Flips the coin and shows heads/tails.";
    }
    
    async onCommand(message, commandArgs){
        message.channel.startTyping()
        
        var embed = new EmbedBuilder().build()
            .setTitle("CoinFlip")
        
        if(commandArgs[0]){
            var ht = commandArgs[0].toLowerCase();
            
            if(ht != 'heads' && ht != 'tails') {
                embed.setDescription('**Usage:** ' + this.usage)
                message.channel.stopTyping()
                message.channel.send(embed)
                return;
            }
            
            var flip = this.flip()
            message.channel.send(embed.setDescription('Flipping coin....')).then(sent => {
                setTimeout(() => {
                    if(flip == ht){
                        embed.setColor('#00FF00').setDescription('It is a **'+ flip +'**. You Won!')
                    } else {
                        embed.setColor('#FF0000').setDescription('It is a **'+ flip +'**. You Lost!')
                    }
                    message.channel.stopTyping()
                    sent.edit(embed)
                }, 1300)
            })
        } else {
            
            message.channel.send(embed.setDescription('Flipping coin...')).then(sent => {
                embed.setDescription('It is a **'+ this.flip() +'**.')
                
                setTimeout(() => {                
                    message.channel.stopTyping()
                    sent.edit(embed)
                }, 1300)
            })
        }
    }
    
    flip(){
        const rand = Math.round(Math.random())
        
        return (rand == 0) ? "heads" : "tails";
    }
}

module.exports = CoinFlipCommand;