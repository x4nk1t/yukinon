const Color = require('../utils/Color.js');
const Command = require('./Command.js');

class CoinFlipCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, "coinflip", "Flips the coin and shows head/tail.", "[head|tail]");
    }
    
    execute(message, commandArgs){
        message.channel.sendTyping()
        
        var embed = {
            title: "CoinFlip",
            color: Color.random()
        }
        
        if(commandArgs[0]){
            var ht = commandArgs[0].toLowerCase();
            
            if(ht != 'head' && ht != 'tail') {
                embed.description = '**Usage:** ' + this.usage;
                
                message.channel.createMessage({embed: embed})
                return;
            }
            
            var flip = this.flip()
            embed.description = 'Flipping coin....';
            message.channel.createMessage({embed: embed}).then(sent => {
                setTimeout(() => {
                    if(flip == ht){
                        embed.color = Color.color('#00FF00')
                        embed.description = 'Its a **'+ flip +'**. You Won!'
                    } else {
                        embed.color = Color.color('#FF0000')
                        embed.description = 'Its a **'+ flip +'**. You Lost!'
                    }
                    sent.edit({embed: embed})
                }, 1300)
            })
        } else {
            embed.description = 'Flipping coin....';
            message.channel.createMessage({embed: embed}).then(sent => {
                embed.color = Color.random()
                embed.description = 'Its a **'+ this.flip() +'**.';
                
                setTimeout(() => {
                    sent.edit({embed: embed})
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