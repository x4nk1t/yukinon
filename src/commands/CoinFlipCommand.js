const discord = require('discord.js');

class CoinFlipCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix +"coinflip [heads|tails]";
        this.description = "Flips the coin and shows heads/tails.";
    }
    
    onCommand(message, commandArgs){
        message.channel.startTyping()
        
        var embed = new discord.MessageEmbed()
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
            
            if(flip == ht){
                embed.setColor('#00FF00').setDescription('It is a **'+ flip +'**. You Won!')
            } else {
                embed.setColor('#FF0000').setDescription('It is a **'+ flip +'**. You Lost!')
            }
            
            message.channel.stopTyping()
            message.channel.send(embed)
        } else {
            embed.setDescription('It is a **'+ this.flip() +'**')
            
            message.channel.stopTyping()
            message.channel.send(embed)
        }
        
    }
    
    flip(){
        const rand = Math.round(Math.random())
        
        return (rand == 0) ? "heads" : "tails";
    }
}

module.exports = CoinFlipCommand;