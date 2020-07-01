const os = require('os')
const Color = require('../utils/Color.js');
const Command = require('./Command.js');

class StatsCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, "stats", "Shows the stats of the bot/server.");
    }
    
    execute(message, commandArgs){
        message.channel.sendTyping()
        
        const type = os.type();
        const cpuCount = os.cpus().length;
        const arch = os.arch();
        const freemem = Math.round(os.freemem() / 1024 / 1024); //IN MB
        const totalmem = Math.round(os.totalmem() /1024 / 1024); //IN MB
        const version = os.version();
        const totalServer = this.client.guilds.size;
        
        var embed = {
            title: 'Stats',
            color: Color.random(),
            fields: [
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
                    name: 'OS',
                    value: (totalmem - freemem) +' MB / ' + totalmem + ' MB',
                    inline: true
                },
                {
                    name: 'Servers',
                    value: totalServer,
                    inline: true
                },
            ]
        }
        
        message.channel.createMessage({embed: embed});
    }
}

module.exports = StatsCommand