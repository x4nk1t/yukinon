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
        const totalServer = this.client.guilds.cache.size;
        
        var embed = Color.random()
            .setTitle('Stats')
            .addField('OS', type, true)
            .addField('CPU Count', cpuCount, true)
            .addField('Arch', arch, true)
            .addField('Version', version, true)
            .addField('RAM', (totalmem - freemem) +' MB / ' + totalmem + ' MB', true)
            .addField('Servers', totalServer, true)
        
        message.channel.stopTyping()
        message.channel.send(embed);
    }
}

module.exports = StatsCommand