const Command = require('../../../utils/Command.js')

class Pause extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'pause',
            description: 'Pause music.',
            guildOnly: true
        })
    }

    async execute(message, commandArgs){
        const member = message.member;
        const bot_member = message.member.guild.member(this.client.user)
        const bot_vc = bot_member.voice.channel;

        if(!bot_vc){
            message.channel.send(this.embed('Bot is not connected to any voice channels.'))
            return
        }
        
        if(member.voice.channel){
            const voiceChannel = member.voice.channel;
            if(voiceChannel.id == bot_vc.id){
                const connection = message.guild.voice.connection;
                if(connection){
                    const dispatcher = connection.dispatcher;
                    if(dispatcher.paused){
                        message.channel.send(this.embed('Music is already paused.'))
                    } else {
                        dispatcher.pause()
                        message.channel.send(this.embed('Music paused.'))
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

module.exports = Pause