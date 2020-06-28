const request = require('request');
const discord = require('discord.js');
const EmbedBuilder = require('../utils/EmbedBuilder.js');

class ARCCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix +"arc <add|remove>";
        this.description = "Adds/Removes the current channel for anime release posts.";
    }
    
    onCommand(message, commandArgs){
        message.channel.startTyping()
        var embed = new EmbedBuilder().build()
            .setTitle('ARC Command')
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                this.commandLoader.server.addChannelToAnimeRelease(message.channel.id, (data) => {
                    if(data.status == 0){
                        embed.setDescription('Successfully added this channel to the list.').setTimestamp()
                        
                        this.commandLoader.server.animeScarper.animeReleaseChannels.push(message.channel.id)
                    } else if(data.status == 1){
                        embed.setDescription(data.message).setTimestamp()
                    } else {
                        embed.setDescription('Something went wrong while adding this channel from the list.').setTimestamp()
                    }
                    message.channel.stopTyping()
                    message.channel.send(embed);
                })
            } else if(commandArgs[0] == "remove"){
                this.commandLoader.server.removeChannelFromAnimeRelease(message.channel.id, (data) => {
                    if(data.status == 0){
                        embed.setDescription('Successfully removed this channel from the list.').setTimestamp()
                        var channels = this.commandLoader.server.animeScarper.animeReleaseChannels;
                        channels.splice(channels.indexOf(message.channel.id), 1)
                    } else if(data.status == 1){
                        embed.setDescription(data.message).setTimestamp()
                    } else{
                         embed.setDescription('Something went wrong while removing this channel.').setTimestamp()
                    }
                    message.channel.stopTyping()
                    message.channel.send(embed);
                })
            } else {
                embed.setDescription('**Usage:** '+ this.usage)
                message.channel.stopTyping()
                message.channel.send(embed)
            }
        } else {
            embed.setDescription('**Usage:** '+ this.usage)
            message.channel.stopTyping()
            message.channel.send(embed)
        }
    }
}

module.exports = ARCCommand;