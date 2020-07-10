const Discord = require('discord.js');
const Command = require('../Command.js');
const ImagesGrabber = require('../../network/ImageGrabber.js');

class Kiss extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "kiss",
            description: "Kiss",
            usage: "[user]"
        });
        
        this.imageGrabber = new ImagesGrabber(this.client)
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        var user = '';
        if(commandArgs[0]) user = commandArgs[0]
        this.imageGrabber.getImage('/img/kiss', (imageUrl) => {
            var embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(message.author.username + ' kisses ' + user)
                .setImage(imageUrl)
                .setTimestamp()
            
            message.channel.send(embed)
            message.channel.stopTyping()
        })
        
    }
}

module.exports = Kiss