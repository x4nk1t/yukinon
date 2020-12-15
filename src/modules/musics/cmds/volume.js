const Command = require('../../../utils/Command.js')

class Volume extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'volume',
            description: 'Adjust volume.',
            usage: '<1-100>',
            aliases: ['v'],
            guildOnly: true
        })
    }

    async execute(message, commandArgs){
        const member = message.member;
        const bot_member = message.member.guild.member(this.client.user)
        const bot_vc = bot_member.voice.channel;
        const volumeLevel = commandArgs[0];

        if(!bot_vc){
            message.channel.send(this.embed('Bot is not connected to any voice channels.'))
            return
        }

        if(!volumeLevel){
            this.sendUsage(message);
            return
        }

        if(!isNaN(volumeLevel) && !isNaN(parseFloat(volumeLevel))){
            if(volumeLevel > 100 || volumeLevel < 0){
                message.channel.send(this.embed('What the?? Volume is only 1-100'))
                return
            }

            if(member.voice.channel){
                const voiceChannel = member.voice.channel;
                if(voiceChannel.id == bot_vc.id){
                    const connection = message.guild.voice.connection;
                    const volume = volumeLevel / 100;
                    if(!connection.dispatcher){
                        message.channel.send(this.embed('Nothing is currently playing.'))
                    } else {
                        connection.dispatcher.setVolume(volume)
                        message.channel.send(this.embed('Set volume level to **'+ volumeLevel + '**'))
                    }
                } else {
                    message.channel.send(this.embed('You must be in **same** voice channel.'))
                }
            } else {
                message.channel.send(this.embed('You must be connected to voice channel.'))
            }
        } else {
            this.sendUsage(message)
        }
    }

    embed(message){
        return {embed: {color: 'BLUE', description: message}}
    }
}

module.exports = Volume