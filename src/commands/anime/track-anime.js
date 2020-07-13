const Discord = require('discord.js');
const Command = require('../Command.js');

class TrackAnime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "track-anime",
            description: "Add anime to track in the channel.",
            usage: "<add|remove> <anime id>",
            aliases: ['track']
        });
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
        
        if(commandArgs[0] && commandArgs[1]){
            const anime_id = commandArgs[1]
            if(commandArgs[0] == "add"){
                this.client.dbapi.addTrackingAnime(message.channel, anime_id,(error, data) => {
                    if(!error){
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else if (commandArgs[0] == "remove"){
                this.client.dbapi.removeTrackingAnime(message.channel, anime_id, (error, data) => {
                    if(!error){
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else {
                embed.setDescription('**Usage:** '+ this.usage)
                message.channel.send(embed)
                message.channel.stopTyping()
            }
        } else {
            embed.setDescription('**Usage:** '+ this.usage)
            message.channel.send(embed)
            message.channel.stopTyping()
        }
    }
}

module.exports = TrackAnime