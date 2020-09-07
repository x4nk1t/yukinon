const Discord = require('discord.js');
const Command = require('../Command.js');

class Mute extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "mute",
            description: "Mutes a user. *(Admin only)*",
            usage: "<user> [reason]",
            permissions: ['MANAGE_ROLES', 'MANAGE_SERVER'],
            guildCommand: true
        });
    }
    
    execute(message, commandArgs){
        if(!this.hasRequiredPermissions(message)){
            return
        }
        
        const embed = new Discord.MessageEmbed()
            .setColor('RED')
        
        if(commandArgs[0]){
            if(!message.mentions.users.first()){
                message.channel.send('You must mention the user to mute.')
                return
            }
            const member = message.guild.member(message.mentions.users.first());
            commandArgs.shift()
            const reason = commandArgs.join(' ') || "N/A"
            if(!member) {
                message.reply('That user does not exist!')
                return
            }
            const muteRole = message.guild.roles.cache.find(role => role.name == "MUTED");
            const modLog = message.guild.channels.cache.find(channel => channel.name == "mod-logs")
            
            member.roles.remove(member.roles.cache).then(() => {
                if(muteRole){
					member.roles.add(muteRole).then(() => {
						embed.setTitle('Mute Log')
							.setThumbnail(member.user.avatarURL())
							.addField('User', member.user.tag)
							.addField('Reason', reason)
							.setFooter('Muted by '+ message.author.tag, message.author.avatarURL())
							.setTimestamp()
                        
                        if(modLog){
                            modLog.send(embed)
                        }
					})
                }
            })
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = Mute