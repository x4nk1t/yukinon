const Discord = require('discord.js');
const Command = require('../Command.js');
const ImagesGrabber = require('../../utils/ImagesGrabber.js');

class Poke extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "poke",
            description: "Poke",
            usage: "[user]"
        });
        
        this.imageGrabber = new ImagesGrabber(this.client)
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        var user = '';
        if(commandArgs[0]) user = commandArgs[0]
        this.imageGrabber.getImage('/img/poke', (imageUrl) => {
            var embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(message.author.username + ' pokes ' + user)
                .setImage(imageUrl)
                .setTimestamp()
            
            message.channel.send(embed)
            message.channel.stopTyping()
        })
        
    }
}

module.exports = Poke