const Discord = require('discord.js');
const Command = require('../Command.js');

class Ban extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "ban",
            description: "Bans a user. *(Admin only)*",
            usage: "<user> [reason]",
            permissions: ['MANAGE_ROLES'],
            guildCommand: true
        });
    }
    
    execute(message, commandArgs){
        if(!this.hasRequiredPermissions(message)){
            return
        }

        message.channel.startTyping()
        
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
        
        if(commandArgs[0]){
            const member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            commandArgs.shift()
            const reason = commandArgs.join(' ') || "N/A"
            if(!member) {
                message.reply('That user does not exist!')
                return
            }
            const banRole = message.guild.roles.cache.find(role => role.name == "BANNED");
            const banLog = message.guild.channels.cache.find(channel => channel.name == "ban-log")
            
            member.roles.remove(user.roles.cache).then(() => {
                member.roles.add(banRole).then(() => {
                    embed.setTitle('Ban Log')
                        .setThumbnail(member.user.avatarURL())
                        .addField('User', member.user.tag)
                        .addField('Reason', reason)
                        .setFooter('Banned by '+ message.author.tag, message.author.avatarURL())
                    
                    banLog.send(embed)
                })
            })
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = Ban
