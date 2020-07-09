const Discord = require('discord.js');
const Command = require('../Command.js');
const ImagesGrabber = require('../../utils/ImagesGrabber.js');

class Hug extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "hug",
            description: "Hug",
            usage: "[user]"
        });
        
        this.imageGrabber = new ImagesGrabber(this.client)
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        var user = '';
        if(commandArgs[0]) user = commandArgs[0]
        this.imageGrabber.getImage('/img/hug', (imageUrl) => {
            var embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(message.author.username + ' hugs ' + user)
                .setImage(imageUrl)
                .setTimestamp()
            
            message.channel.send(embed)
            message.channel.stopTyping()
        })
        
    }
}

module.exports = Hug