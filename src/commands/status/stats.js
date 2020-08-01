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
                    name: 'Ping',
                    value: (new Date().getTime() - message.createdTimestamp) +'ms',
                    inline: true
                },
                {
                    name: 'Uptime',
                    value: this.getUptime(),
                    inline: true
                },{ 
                    name: 'Memory Usage',
                    value: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB',
                    inline: true
                },
                {
                    name: 'Guilds',
                    value: this.client.guilds.cache.size,
                    inline: true
                },
                {
                    name: 'Channels',
                    value: this.channels.cache.size,
                    inline: true
                },
                {
                    name: 'Users',
                    value: this.client.users.cache.size,
                    inline: true
                }
            ])
            .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
        
        message.channel.send(embed);
        message.channel.stopTyping()
    }
    
    getUptime(){
        var date_in_ms = this.client.uptime;
        
        var delta = Math.abs(date_in_ms) / 1000;

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        
        var seconds = Math.round(delta % 60);
        
        return (days +'d '+ hours +'h '+ minutes + 'm '+ seconds + 's')
    }
}

module.exports = Stats