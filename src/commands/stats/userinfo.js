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
        if(!message.mentions.users.first()){
            message.channel.send("You must mention a user.")
            return
        }
        var member = message.guild.member(message.mentions.users.first());        
        var embed = {
            title: member.user.username,
            color: 'BLUE',
            thumbnail: {url: member.user.displayAvatarURL()},
            fields: [
                { name: 'ID', value: member.user.id, inline: true },
                { name: 'Tag', value: member.user.tag, inline: true },
                { name: 'Nickname', value: member.nickname || 'N/A', inline: true },
                { name: 'Joined At', value: new Date(member.joinedAt).toDateString() },
                { name: 'Roles', value: member.roles.cache.map(role => `${role}`).toString() }
            ],
            footer: {text: 'Requested by '+ message.author.username, icon_url: message.author.displayAvatarURL()}
        }
        message.channel.send({embed: embed});
    }
}

module.exports = UserInfo
