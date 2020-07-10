const Discord = require('discord.js');
const Command = require('../Command.js');
const ImagesGrabber = require('../../network/ImageGrabber.js');

class Smug extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "smug",
            description: "Smug"
        });
        
        this.imageGrabber = new ImagesGrabber(this.client)
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        this.imageGrabber.getImage('/img/smug', (imageUrl) => {
            var embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(message.author.username + ' smugs')
                .setImage(imageUrl)
                .setTimestamp()
            
            message.channel.send(embed)
            message.channel.stopTyping()
        })
        
    }
}

module.exports = Smug