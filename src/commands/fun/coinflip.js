const Discord = require('discord.js')
const Command = require('../Command.js');

class Coinflip extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "coinflip",
            description: "Flips the coin and shows head/tail.",
            usage: "[head|tail]",
            aliases: ['coin', 'cf']
        });
    }
    
    execute(message, commandArgs){        
        var embed = new Discord.MessageEmbed()
            .setTitle("CoinFlip")
            .setColor('RANDOM')
        
        if(commandArgs[0]){
            var ht = commandArgs[0].toLowerCase();
            if(ht == 'h') ht = 'head';
            if(ht == 't') ht = 'tail';
            
            if(ht != 'head' && ht != 'tail') {
                this.sendUsage(message)
                return;
            }
            
            var flip = this.flip()
            embed.setDescription('Flipping coin....');
            message.channel.send(embed).then(sent => {
                setTimeout(() => {
                    if(flip == ht){
                        embed.setColor('#00FF00')
                        embed.setDescription('Its a **'+ flip +'**. You Won!')
                        embed.setFooter('Coin flipped by '+ message.author.username)
                    } else {
                        embed.setColor('#FF0000')
                        embed.setDescription('Its a **'+ flip +'**. You Lost!')
                        embed.setFooter('Coin flipped by '+ message.author.username)
                    }
                    sent.edit(embed)
                }, 1300)
            })
        } else {
            embed.setDescription('Flipping coin....');
            message.channel.send(embed).then(sent => {
                embed.setColor('RANDOM')
                    .setDescription('Its a **'+ this.flip() +'**.')
                    .setFooter('Coin flipped by '+ message.author.username)
                
                setTimeout(() => {
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

module.exports = Coinflip;
