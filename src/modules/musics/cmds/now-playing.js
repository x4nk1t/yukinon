const Command = require('../../../utils/Command.js')

class NowPlaying extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'now-playing',
            description: 'Check what\'s playing.',
            aliases: ['np'],
            guildOnly: true
        })
    }

    async execute(message, commandArgs){
        const member = message.member;
        const manager = this.client.musicManager;
        const bot_member = message.member.guild.member(this.client.user)
        const bot_vc = bot_member.voice.channel;
        const voiceChannel = member.voice.channel;

        if(!bot_vc){
            message.channel.send(this.embed('Bot is not connected to any voice channels.'))
            return
        }

        if(voiceChannel.id !== bot_vc.id){
            message.channel.send(this.embed('You must be in **same** voice channel.'))
            return
        }

        const queue = manager.queue.get(voiceChannel.id);
        if(!queue) {
            message.channel.send(this.embed('Nothing is playing.'))
            return
        }
        const current = queue.queues[0]
        
        var embed = {color: 'BLUE', url: current.link, thumbnail: {url: current.thumbnail}}
        
        const connection = message.guild.voice.connection;
        const dispatcher = connection.dispatcher;
        
        if(!dispatcher) return
        
        const paused = dispatcher.paused ? ' [Paused]' : '';
        var description = `\`${this.generateTimeBar(dispatcher.streamTime, (current.length * 1000))}\`\n\`${this.getTime(dispatcher.streamTime)}\` / \`${this.getTimeFromSeconds(current.length)}\``;
        
        embed.title = this.shortText(current.title) + paused;
        embed.description = description;

        message.channel.send({embed: embed})
    }

    generateTimeBar(nowTime, maxTime){
        if(isNaN(nowTime)) nowTime = 0;
        
        const percent = Math.round((nowTime / maxTime) * 20);
        var timeBar = '';
        
        for(var i = 0; i < 20; i++){
            if(i == percent){
                timeBar += '🔘';
            } else {
                timeBar += '▬';
            }
        }

        return timeBar;
    }

    getTimeFromSeconds(time){
        return this.getTime(time * 1000)
    }

    getTime(time){
        const time_in_seconds = Math.round(time / 1000);
        var minutes = ('0'+ Math.floor(time_in_seconds / 60)).slice(-2);
        var remainder = time_in_seconds % 60;

        var seconds = ('0' + Math.floor(remainder)).slice(-2);

        return `${minutes}:${seconds}`;
    }

    shortText(text, length = 40) {
        if (text == null) {
            return "";
        }
        if (text.length <= length) {
            return text;
        }
        text = text.substring(0, length);
        var last = text.lastIndexOf(" ");
        text = text.substring(0, last);
        return text + "...";
    }

    embed(message){
        return {embed: {color: 'BLUE', description: message}}
    }
}

module.exports = NowPlaying