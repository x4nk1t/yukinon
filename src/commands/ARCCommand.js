const request = require('request');
const discord = require('discord.js');
const EmbedBuilder = require('../utils/EmbedBuilder.js');

class ARCCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix +"arc <add|remove>";
        this.description = "Adds/Removes the current channel for anime release posts.";
        
        this.baseUrl = "https://4nk1t.gq/api/bot.php?pass=mys3cr3tk3y&";
    }
    
    onCommand(message, commandArgs){
        message.channel.startTyping()
        var embed;
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                this.addChannel(message.channel.id, (data) => {
                    if(data.status == 0){
                        embed = new EmbedBuilder().build()
                            .setTitle('ARC Command')
                            .setDescription('Successfully added this channel to the list.')
                            .setTimestamp()
                        
                        this.commandLoader.server.animeScarper.animeReleaseChannels.push(message.channel.id)
                    } else {
                         embed = new EmbedBuilder().build()
                            .setTitle('ARC Command')
                            .setDescription('Something went wrong while removing this channel from the list.')
                            .setTimestamp()
                    }
                    message.channel.stopTyping()
                    message.channel.send(embed);
                })
            } else if(commandArgs[0] == "remove"){
                this.removeChannel(message.channel.id, (data) => {
                    if(data.status == 0){
                        embed = new EmbedBuilder().build()
                            .setTitle('ARC Command')
                            .setDescription('Successfully removed this channel from the list.')
                            .setTimestamp()
                        var channels = this.commandLoader.server.animeScarper.animeReleaseChannels;
                        channels.splice(channels.indexOf(message.channel.id), 1)
                    } else {
                         embed = new EmbedBuilder().build()
                            .setTitle('ARC Command')
                            .setDescription('Something went wrong while removing this channel.')
                            .setTimestamp()
                    }
                    message.channel.stopTyping()
                    message.channel.send(embed);
                })
            }
        }
    }
    
    addChannel(id, callback){
        request(this.baseUrl +'addAnimeReleaseChannel=' + id, (err, response, body) => {
            if(!err){
                const parsed = JSON.parse(body);
                callback(parsed)
            } else {
                this.server.logger.error("Something went wrong: " + err);
            }
        })
    }
    
    removeChannel(id, callback){
        request(this.baseUrl + 'removeAnimeReleaseChannel=' + id, (err, response, body) => {
            if(!err){
                const parsed = JSON.parse(body);
                callback(parsed)
            } else {
                this.server.logger.error("Something went wrong: " + err);
            }
        })
    }
}

module.exports = ARCCommand;