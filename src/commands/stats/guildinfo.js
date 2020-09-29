const Discord = require('discord.js');
const Command = require('../Command.js');

class GuildInfo extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "guildinfo",
            description: "Shows the info of guild.",
            aliases: ['gi']
        });
    }
    
    execute(message, commandArgs){
        var guild = message.guild;
        
        var embed = new Discord.MessageEmbed()
            .setTitle('Guild Info')
            .setColor('BLUE')
            .setThumbnail(message.guild.iconURL())
            .addFields([
                {
                    name: 'ID',
                    value: guild.id,
                    inline: true
                },
        		{
                    name: 'Name',
                    value: guild.name,
                    inline: true
		        },
                {
                    name: 'Owner',
                    value: guild.owner.user.tag,
                    inline: true
                },
                {
                    name: 'Region',
                    value: guild.region,
                    inline: true
                },
                { 
                    name: 'Role Count',
                    value: guild.roles.cache.array().length,
                    inline: true
                },
                {
                    name: 'Channels',
                    value: guild.channels.cache.array().length,
                    inline: true
                },
                {
                    name: 'Members',
                    value: guild.memberCount,
                    inline: true
                }, 
                {
                    name: 'Created At',
                    value: guild.createdAt,
                }, 
            ])
            .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
        message.channel.send(embed);
    }
}

module.exports = GuildInfo 
