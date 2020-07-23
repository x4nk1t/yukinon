const Discord = require('discord.js');
const Command = require('../Command.js');

class TrackAnime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "track-anime",
            description: "Add anime to track in the channel.",
            usage: "<add|remove|list|clear> <anime id>",
            aliases: ['track']
        });
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                commandArgs.shift()
                const anime = commandArgs.join(' ')
                if(anime == ''){
                    this.sendUsage(message)
                    return;
                }
                this.client.dbapi.addTrackingAnime(message.channel, anime,(error, data) => {
                    if(!error){
                        this.addTrackToArray(message.channel, anime)
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else if (commandArgs[0] == "remove"){
                commandArgs.shift()
                const anime = commandArgs.join(' ')
                if(anime == ''){
                    this.sendUsage(message)
                    return;
                }
                this.client.dbapi.removeTrackingAnime(message.channel, anime, (error, data) => {
                    if(!error){
                        this.removeTrackFromArray(message.channel, anime)
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else if(commandArgs[0] == "list") {
                const channels = this.client.animeRelease.release_channels;
                var found = false;
                channels.forEach(chh => {
                    if(chh.channel_id == message.channel.id){
                        found = true;
                        const trackings = chh.tracking.split(',').join(', ')
                        
                        if(chh.tracking != ''){
                            embed.setColor('RANDOM')
                            embed.setTitle('This channel is tracking:')
                            embed.setDescription(trackings)
                        } else {
                            embed.setDescription('This channel isn\'t tracking any anime.')
                        }
                        
                        message.channel.send(embed)
                        message.channel.stopTyping()
                        return;
                    }
                })
                if(!found){
                    embed.setDescription('This channel isn\'t anime release channel.')
                    message.channel.send(embed)
                    message.channel.stopTyping();
                }
                return;
            } else if(commandArgs[0] == "clear") {
                const channels = this.client.animeRelease.release_channels;
                var found = false;
                channels.forEach(chh => {
                    if(chh.channel_id == message.channel.id){
                        chh.trackings = '';
                        found = true;
                        this.client.dbapi.removeTrackingAnime(message.channel, 'all', (error, data) => {
                            if(!error){
                                this.clearTrackArray(message.channel)
                                embed.setColor('RANDOM')
                            }
                            embed.setDescription(data.message)
                            message.channel.send(embed)
                            message.channel.stopTyping()
                        })
                    }
                })
                if(!found){
                    embed.setDescription('This channel isn\'t anime release channel.')
                    message.channel.send(embed)
                    message.channel.stopTyping();
                }
                return;
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }
    
    filterName(string){
        return string.toLowerCase().replace(' ', '').replace('\t', '')
    }
    
    addTrackToArray(channel, name){
        var channels = this.client.animeRelease.release_channels;
        channels.forEach(chh => {
            if(chh.channel_id == channel.id){
                var split = chh.tracking.split(',')
                
                split.forEach((s, i) => {
                    if(s == '') split.splice(i, 1)
                    if(this.filterName(s) == this.filterName(name)){
                        return;
                    }
                })
                split.push(name)
                chh.tracking = split.join(',') + ',';
            }
        })
    }
    
    removeTrackFromArray(channel, name){
        var channels = this.client.animeRelease.release_channels;
        channels.forEach(chh => {
            if(chh.channel_id == channel.id){
                var split = chh.tracking.split(',')
                
                split.forEach((s, i) => {
                    if(s == '') split.splice(i, 1)
                    if(this.filterName(s) == this.filterName(name)){
                        split.splice(i, 1)
                    }
                })
                
                chh.tracking = split.join(',') +',';
            }
        })
    }
    
    clearTrackArray(channel){
        var channels = this.client.animeRelease.release_channels;
        channels.forEach(chh => {
            if(chh.channel_id == channel.id){
                chh.tracking = '';
            }
        })
    }
}

module.exports = TrackAnime