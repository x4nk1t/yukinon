const Discord = require('discord.js')
const Command = require('../../../utils/Command.js')

class BlackJack extends Command {
    constructor(commandLoader){
        super(commandLoader, {
            name: 'blackjack',
            description: 'Play blackjack game',
            aliases: ['bj']
        })
        
        this.games = new Discord.Collection()
        
        this.emojis = ['⏪', '⏩'];
    }
    
    async generateGame(message){
        this.games.set(message.author.id, {running: true})
        
        var uTotal = Math.round(Math.random() * 13) + Math.floor(Math.random() * 13);
        var dTotal = Math.round(Math.random() * 13);
        
        var embed = {color: 'YELLOW'}
        
        embed.fields = []
        embed.fields.push({name: 'Your total', value: uTotal, inline: true})
        embed.fields.push({name: 'Dealer\'s total', value: dTotal, inline: true})
        
        const sent = await message.channel.send({embed: embed})
        
        this.emojis.forEach(emoji => {
            sent.react(emoji)
        })
        
        const reactionCollector = sent.createReactionCollector((reaction, user) => this.emojis.includes(reaction.emoji.name) && !user.bot, {time: 30000})
        
        reactionCollector.on('collect', reaction => {
            reaction.users.remove(message.author)
            
            switch(reaction.emoji.name){
                case this.emojis[0]:
                    uTotal += Math.round(Math.random() * 13);
                    dTotal += Math.round(Math.random() * 13);
                    break;
                case this.emojis[1]:
                    
                    break;
            }
            var newEmbed = {color: 'YELLOW'}
            newEmbed.fields = [];
            newEmbed.fields.push({name: 'Your total', value: uTotal, inline: true})
            newEmbed.fields.push({name: 'Dealer\'s total', value: dTotal, inline: true})
            
            sent.edit({embed: newEmbed})
        })
    }
    
    execute(message, commandArgs){
        message.channel.send('WIP')
        return
        const gameId = message.author.id;
        if(commandArgs[0] && commandArgs[0] == 'x'){
            if(this.games.get(gameId)){
                this.games.delete(gameId)
                message.channel.send('Your game has been cancelled.')
            } else {
                message.channel.send('You don\'t have any games running. Use `'+ this.prefix +'bj` to start a game.')
            }
            
            return
        }
        
        if(this.games.get(message.author.id)){
            message.reply('You already have a game running! Use `'+ this.prefix +'bj x` to cancel current game.')
            return
        }
        
        this.generateGame(message)
    }
}

module.exports = BlackJack
