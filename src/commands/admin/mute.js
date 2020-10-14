const Command = require('../Command.js');

class Mute extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "mute",
            description: "Mutes a user. *(Admin only)*",
            usage: "<user> [reason]",
            permissions: {administrator: true},
            argsRequired: true
        });
    }
    
    execute(message, commandArgs){
        var embed = {
            color: this.client.embedRedColor 
        }
        
        if(commandArgs[0]){
            if(!message.mentions[0]){
                message.channel.createMessage('You must mention a user to mute.')
                return
            }
            const member = message.channel.guild.members.get(message.mentions[0].id);
            commandArgs.shift()
            const reason = commandArgs.join(' ') || "N/A"

            if(!member) {
                message.channel.createMessage('That user does not exist!')
                return
            }
            const muteRole = message.channel.guild.roles.find(role => role.name.toLowerCase() == "muted");
            const modLog = message.channel.guild.channels.find(channel => channel.name == "mod-logs")
            
            member.edit({roles: [muteRole.id]}).then(() => {
                modLog.createMessage({embed: {
                    title: 'Mute Log',
                    color: this.client.embedRedColor,
                    fields: [
                        {name: 'User', value: member.user.username +'#'+ member.user.discriminator},
                        {name: 'Reason', value: reason ? reason : 'N/A'}
                    ],
                    footer: {
                        text: 'Muted by '+ message.author.username
                    },
                    timestamp: new Date()
                }})
                message.channel.createMessage('Successfully muted!!').then(m => {
                    setTimeout(() => {
                        m.delete()
                        message.delete()
                    }, 2000)
                })
            })
        }
    }
}

module.exports = Mute
