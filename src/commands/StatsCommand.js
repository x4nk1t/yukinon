const EmbedBuilder = require('../utils/EmbedBuilder.js');
const os = require('os')

class StatsCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix +"stats";
        this.description = "Shows the stats of the bot/server.";
    }
    
    onCommand(message, commandArgs){
        message.channel.startTyping()
        
        const type = os.type();
        const cpuCount = os.cpus().length;
        const arch = os.arch();
        const freemem = Math.round(os.freemem() / 1024 / 1024); //IN MB
        const totalmem = Math.round(os.totalmem() /1024 / 1024); //IN MB
        const version = os.version();
        const totalServer = this.commandLoader.server.client.guilds.cache.size;
        
        var embed = new EmbedBuilder().build()
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