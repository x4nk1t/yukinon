const os = require('os')
const Color = require('../utils/Color.js');
const Command = require('./Command.js');

class Stats extends Command{
    constructor(commandLoader){
        super(commandLoader, "stats", "Shows the stats of the bot/server.");
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        const type = os.type();
        const cpuCount = os.cpus().length;
        const arch = os.arch();
        const freemem = Math.round(os.freemem() / 1024 / 1024); //IN MB
        const totalmem = Math.round(os.totalmem() /1024 / 1024); //IN MB
        const version = os.version();
        
        var embed = {
            title: 'Stats',
            color: Color.random(),
            fields: [
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
            ]
        }
        
        message.channel.send({embed: embed});
        message.channel.stopTyping()
    }
}

module.exports = Stats