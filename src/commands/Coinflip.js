const Color = require('../utils/Color.js');
const Command = require('./Command.js');

class Coinflip extends Command{
    constructor(commandLoader){
        super(commandLoader, "coinflip", "Flips the coin and shows head/tail.", "[head|tail]", ['cf']);
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var embed = {
            title: "CoinFlip",
            color: Color.random()
        }
        
        if(commandArgs[0]){
            var ht = commandArgs[0].toLowerCase();
            
            if(ht != 'head' && ht != 'tail') {
                embed.description = '**Usage:** ' + this.usage;
                
                message.channel.send({embed: embed})
                message.channel.stopTyping()
                return;
            }
            
            var flip = this.flip()
            embed.description = 'Flipping coin....';
            message.channel.send({embed: embed}).then(sent => {
                setTimeout(() => {
                    if(flip == ht){
                        embed.color = '#00FF00'
                        embed.description = 'Its a **'+ flip +'**. You Won!'
                    } else {
                        embed.color = '#FF0000'
                        embed.description = 'Its a **'+ flip +'**. You Lost!'
                    }
                    sent.edit({embed: embed})
                }, 1300)
            })
        } else {
            embed.description = 'Flipping coin....';
            message.channel.send({embed: embed}).then(sent => {
                embed.color = Color.random()
                embed.description = 'Its a **'+ this.flip() +'**.';
                
                setTimeout(() => {
                    sent.edit({embed: embed})
                }, 1300)
            })
        }
        message.channel.stopTyping()
    }
    
    flip(){
        const rand = Math.round(Math.random())
        
        return (rand == 0) ? "head" : "tail";
    }
}

module.exports = Coinflip;