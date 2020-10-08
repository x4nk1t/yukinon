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
        var guild = message.channel.guild;
        var owner = this.client.users.get(guild.ownerID)
        var embed = {
            title: guild.name,
            color: this.client.embedColor,
            thumbnail: {url: message.channel.guild.iconURL},
            fields: [
                {
                    name: 'ID',
                    value: guild.id,
                    inline: true
                },
                {
                    name: 'Owner',
                    value: owner.username +'#'+ owner.discriminator,
                    inline: true
                },
                {
                    name: 'Region',
                    value: guild.region,
                    inline: true
                },
                { 
                    name: 'Role Count',
                    value: guild.roles.size,
                    inline: true
                },
                {
                    name: 'Channels',
                    value: guild.channels.size,
                    inline: true
                },
                {
                    name: 'Members',
                    value: guild.memberCount,
                    inline: true
                }, 
                {
                    name: 'Created At',
                    value: new Date(guild.createdAt).toDateString(),
                }, 
            ],
            footer: {text: 'Requested by '+ message.author.username, icon_url: message.author.avatarURL}
        }
        message.channel.createMessage({embed: embed});
    }
}

module.exports = GuildInfo 
