const Color = require('../utils/Color.js');
const ReleaseChannels = require('../network/ReleaseChannels.js');
const Command = require('./Command.js');

class ARC extends Command{
    constructor(commandLoader){
        super(commandLoader, "arc", "Adds/Removes the current channel for anime release posts.", "<add|remove>");
        
        this.releaseChannels = new ReleaseChannels(this.bot);
        this.enable = false;
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        var embed = {
            title: 'ARC',
            color: '#FF0000'
        }
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                this.releaseChannels.add(message.channel.id, (data) => {
                    if(data.status == 0){
                        embed.color = '#00FF00'
                        embed.description = 'Successfully added this channel to the list.'
                        
                        this.bot.animeScarper.animeReleaseChannels.push(message.channel.id)
                    } else if(data.status == 1){
                        embed.color = '#FF0000'
                        embed.description = data.message
                    } else {
                        embed.description = 'Something went wrong while adding this channel from the list.'
                    }
                    message.channel.send({embed: embed});
                })
            } else if(commandArgs[0] == "remove"){
                this.releaseChannels.remove(message.channel.id, (data) => {
                    if(data.status == 0){
                        embed.color = '#00FF00'
                        embed.description = 'Successfully removed this channel from the list.'
                        var channels = this.bot.animeScarper.animeReleaseChannels;
                        channels.splice(channels.indexOf(message.channel.id), 1)
                    } else if(data.status == 1){
                        embed.description = data.message
                    } else{
                         embed.description = 'Something went wrong while removing this channel.'
                    }
                    message.channel.send({embed: embed});
                })
            } else {
                embed.description = '**Usage:** '+ this.usage
                message.channel.send({embed: embed})
            }
        } else {
            embed.description = '**Usage:** '+ this.usage
            message.channel.send({embed: embed})
        }
        message.channel.stopTyping()
    }
}

module.exports = ARC;