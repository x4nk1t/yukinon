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
        var owner = guild.members.cache.get(guild.ownerID)
        var embed = {
            title: guild.name,
            color: 'BLUE',
            thumbnail: {url: guild.iconURL()},
            fields: [
                { name: 'ID', value: guild.id, inline: true },
                { name: 'Owner', value: owner.user.tag, inline: true },
                { name: 'Region', value: guild.region, inline: true },
                { name: 'Role Count', value: guild.roles.cache.size, inline: true },
                { name: 'Channels', value: guild.channels.cache.size, inline: true },
                { name: 'Members', value: guild.members.cache.size, inline: true }, 
                { name: 'Created At', value: new Date(guild.createdAt).toDateString() },
            ],
            footer: {text: 'Requested by '+ message.author.username, icon_url: message.author.displayAvatarURL()}
        }
        message.channel.send({embed: embed});
    }
}

module.exports = GuildInfo 
