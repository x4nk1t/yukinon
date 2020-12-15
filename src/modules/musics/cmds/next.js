const Command = require('../../../utils/Command.js')

class Next extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'next',
            description: 'Play next music.',
            guildOnly: true
        })
    }

    async execute(message, commandArgs){
        const member = message.member;
        const bot_member = message.member.guild.member(this.client.user)
        const bot_vc = bot_member.voice.channel;
        const manager = this.client.musicManager;

        if(!bot_vc){
            message.channel.send(this.embed('Bot is not connected to any voice channels.'))
            return
        }

        if(member.voice.channel){
            const voiceChannel = member.voice.channel;
            if(voiceChannel.id == bot_vc.id){
                const connection = message.guild.voice.connection;
                if(connection){
                    const queue = manager.queue.get(voiceChannel.id);

                    if(queue){
                        queue.queues.splice(0, 1)
                        const next = queue.queues[0];
                        if(!next){
                            message.channel.send(this.embed('No more queue left.'))
                            return
                        }
                        const title = next.title;
                        const link = next.link;

                        manager.playMusic(connection, message, voiceChannel, title, link)
                    } else {
                        message.channel.send(this.embed('Nothing\'s playing right now.'))
                    }
                } else {
                    message.channel.send(this.embed('Unknown error.'))
                }
            } else {
                message.channel.send(this.embed('You must be in **same** voice channel.'))
            }
        } else {
            message.channel.send(this.embed('You must be connected to voice channel.'))
        }
    }

    embed(message){
        return {embed: {color: 'BLUE', description: message}}
    }
}

module.exports = Next