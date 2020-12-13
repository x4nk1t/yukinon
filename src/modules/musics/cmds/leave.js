const Command = require('../../../utils/Command.js')

class Leave extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'leave',
            description: 'Leaves the voice channel.',
            aliases: ['l'],
            guildOnly: true
        })
    }

    async execute(message, commandArgs){
        const member = message.member;
        const manager = this.client.musicManager;
        const bot_member = message.member.guild.member(this.client.user)
        const bot_vc = bot_member.voice.channel;

        if(!bot_vc){
            message.channel.send(this.embed('Bot is not connected to any voice channels.'))
            return
        }

        if(member.voice.channel){
            const voiceChannel = member.voice.channel;
            if(voiceChannel.id == bot_vc.id){
                if(manager.queue.get(voiceChannel.id)) manager.queue.delete(voiceChannel.id)
                voiceChannel.leave()
                message.channel.send(this.embed('Queues cleared and left **'+ voiceChannel.name +'**!'))
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

module.exports = Leave