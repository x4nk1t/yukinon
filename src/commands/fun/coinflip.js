const Command = require('../Command.js');

class Coinflip extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "coinflip",
            description: "Flip a coin.",
            usage: "[head|tail]",
            aliases: ['coin', 'cf']
        });
    }
    
    execute(message, commandArgs){        
        var embed = {
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
            embed.description = 'Flipping coin....';
            message.channel.send({embed: embed}).then(sent => {
                setTimeout(() => {
                    if(flip == ht){
                        embed.color = 'GREEN'
                        embed.description = 'Its a **'+ flip +'**. You Won!'
                        embed.footer = {text: 'Coin flipped by '+ message.author.username}
                    } else {
                        embed.color = 'RED'
                        embed.description = 'Its a **'+ flip +'**. You Lost!'
                        embed.footer = {text: 'Coin flipped by '+ message.author.username}
                    }
                    sent.edit({embed: embed})
                }, 1300)
            })
        } else {
            embed.description = 'Flipping coin....';
            message.channel.send({embed: embed}).then(sent => {
                embed.color = 'BLUE'
                embed.description = 'Its a **'+ this.flip() +'**.'
                embed.footer = {text: 'Coin flipped by '+ message.author.username}
                
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

module.exports = Coinflip;
