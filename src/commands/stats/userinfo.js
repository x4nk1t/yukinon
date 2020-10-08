const Command = require('../Command.js');

class UserInfo extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "userinfo",
            description: "Shows the info of user.",
            usage: "<user>",
            aliases: ['ui']
        });
    }
    
    execute(message, commandArgs){
        if(!message.mentions[0]){
            message.channel.createMessage("You must mention a user.")
            return
        }
        var member = message.channel.guild.members.get(message.mentions[0].id);        
        var embed = {
            title: member.user.username,
            color: this.client.embedColor,
            thumbnail: {url:member.user.avatarURL},
            fields: [
                {
                    name: 'ID',
                    value: member.user.id,
                    inline: true
                },
                {
                    name: 'Tag',
                    value: member.user.username +'#'+ member.user.discriminator,
                    inline: true
                },
                {
                    name: 'Nickname',
                    value: member.nick || 'N/A',
                    inline: true
                },
                {
                    name: 'Joined At',
                    value: new Date(member.joinedAt).toDateString(),
                },
                { 
                    name: 'Roles',
                    value: member.roles.map(role => message.channel.guild.roles.get(role).mention).toString(),
                }
            ],
            footer: {text: 'Requested by '+ message.author.username, icon_url: message.author.avatarURL}
        }
        message.channel.createMessage({embed: embed});
    }
}

module.exports = UserInfo
