const Discord = require('discord.js')
const Command = require('../Command.js');
const ytdl = require('ytdl-core')
const fs = require('fs')

class mp3 extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "mp3",
            description: "Returns mp3 with YT url.",
            usage: "<url>",
        });
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var embed = new Discord.MessageEmbed()
        
        if(commandArgs[0]){
            var url = commandArgs[0];
            
            embed.setColor('RANDOM')
            embed.setDescription('Downloading and converting now....')
            
            message.channel.send(embed)
            message.channel.stopTyping()
            
            const d = ytdl(url, {quality: 'highestaudio', filter: 'audioonly'})
            const stream = d.pipe(fs.createWriteStream('audio.mp3'))
            
            stream.on('finish', () => {
                message.channel.send('<@'+message.author.id +'>, The music you requested.')
                
                const file = new Discord.MessageAttachment('audio.mp3')
                message.channel.send({files: [file]})
            })            
        } else {
            this.sendUsage(message)
        }
        message.channel.stopTyping()
    }
}

module.exports = mp3;