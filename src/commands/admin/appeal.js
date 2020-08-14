const Discord = require('discord.js');
const Command = require('../Command.js');

class Appeal extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "appeal",
            description: "Appeal to a ban.",
            usage: "<reason>",
            guildCommand: true
        });
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        const embed = new Discord.MessageEmbed()
            .setColor('GREEN')
            
        if(message.channel.name != "appeal"){
            message.channel.send('This is not the appropriate channel to use this command.')
            message.channel.stopTyping()
            return
        }
        
        if(commandArgs.length > 1){
            const member = message.guild.member(message.author);
            const appealMessage = commandArgs.join(' ')
            
            if(!member){
                message.channel.send('You don\'t exist. LOL')
                message.channel.stopTyping()
                return
            }
            const banRole = member.roles.cache.find(role => role.name == "BANNED")
            if(banRole){
                member.roles.remove(banRole).then(() => {
                    embed.setTitle('Appeal Log')
                        .setThumbnail(member.user.avatarURL())
                        .addField('User', member.user.tag)
                        .addField('Message', appealMessage)
                        .setTimestamp()
                    
                    const banLog = message.guild.channels.cache.find(channel => channel.name == 'ban-log')
                    banLog.send(embed)
                    message.channel.stopTyping()
                })
            } else {
                message.channel.send('-_- Dude, You aren\'t event banned.')
                message.channel.stopTyping()
            }
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = Appeal
