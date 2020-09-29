const Discord = require('discord.js');
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
        var embed = new Discord.MessageEmbed()
            .setTitle('User Info')
            .setColor('BLUE')
            .setThumbnail(member.user.displayAvatarURL())
            .addFields([
                {
                    name: 'User Id',
                    value: member.user.id,
                    inline: true
                },
                {
                    name: 'Tag',
                    value: member.user.tag,
                    inline: true
                },
                {
                    name: 'Display Name',
                    value: member.displayName,
                    inline: true
                },
                {
                    name: 'Joined At',
                    value: member.joinedAt,
                },
                { 
                    name: 'Roles',
                    value: member.roles.cache.array().map(role => role.toString()),
                }
            ])
            .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
        message.channel.send(embed);
    }
}

module.exports = UserInfo
