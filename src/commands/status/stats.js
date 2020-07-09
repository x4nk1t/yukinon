const os = require('os')
const Discord = require('discord.js');
const Command = require('../Command.js');

class Stats extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "stats",
            description: "Shows the stats of the bot/server.",
            aliases: ['status']
        });
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        const type = os.type();
        const cpuCount = os.cpus().length;
        const arch = os.arch();
        const freemem = Math.round(os.freemem() / 1024 / 1024); //IN MB
        const totalmem = Math.round(os.totalmem() /1024 / 1024); //IN MB
        const version = os.version();
        
        var embed = new Discord.MessageEmbed()
            .setTitle('Stats')
            .setColor('RANDOM')
            .addFields([
                {
                    name: 'Servers',
                    value: this.client.guilds.cache.array().length,
                    inline: true
                },
                {
                    name: 'Users',
                    value: this.client.users.cache.array().length,
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b'
                },
                {
                    name: 'OS',
                    value: type,
                    inline: true
                },
                {
                    name: 'CPU Count',
                    value: cpuCount,
                    inline: true
                },
                {
                    name: 'Arch',
                    value: arch,
                    inline: true
                },
                {
                    name: 'Version',
                    value: version,
                    inline: true
                },
                {
                    name: 'RAM',
                    value: (totalmem - freemem) +' MB / ' + totalmem + ' MB',
                    inline: true
                },
            ])
            .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
        
        message.channel.send(embed);
        message.channel.stopTyping()
    }
}

module.exports = Stats