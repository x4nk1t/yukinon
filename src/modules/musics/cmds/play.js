const Command = require('../../../utils/Command.js')
const ytdl = require('ytdl-core');
const MusicManager = require('../MusicManager.js');
const { QueryCursor } = require('mongoose');

class Play extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'play',
            description: 'Play music.',
            usage: '[yt link|query]',
            aliases: ['p'],
            guildOnly: true
        })
    }

    async execute(message, commandArgs){
        const member = message.member;
        const manager = this.client.musicManager;

        if(member.voice.channel){
            const voiceChannel = member.voice.channel;

            if(commandArgs[0]){
                var query = commandArgs[0];
                var bot_vc = message.guild.member(this.client.user).voice.channel;

                if(!bot_vc || bot_vc.id == voiceChannel.id){
                    if(query.startsWith('https://') || query.startsWith('http://')){
                        if(ytdl.validateURL(query)){
                            var info = await ytdl.getBasicInfo(query)
                            var music = info.player_response.videoDetails

                            voiceChannel.join().then(connection => {
                                if(manager.queue.get(voiceChannel.id)){
                                    var queue = manager.queue.get(voiceChannel.id)
                                    if(queue.queues.length){
                                        message.channel.send(this.embed(`Added **${music.title}** to queue.`))
                                    } else {
                                        this.playMusic(connection, message, voiceChannel, music.title, query)
                                    }
                                    queue.queues.push({title: music.title, link: query})
                                } else {
                                    manager.queue.set(voiceChannel.id, {queues: [{title: music.title, link: query}]})
                                    this.playMusic(connection, message, voiceChannel, music.title, query)
                                }
                            })
                        } else {
                            message.channel.send(this.embed('Link is not valid.'))
                        }
                    } else {
                        message.channel.send(this.embed('You must use youtube links to play.'))
                    }
                } else {
                    message.channel.send(this.embed('Bot is already connected to `'+ voiceChannel.name +'`.'))
                }
            } else {
                this.sendUsage(message)
            }
        } else {
            message.channel.send(this.embed('You must be connected to voice channel.'))
        }
    }

    playMusic(connection, message, voiceChannel, title, link){
        const dispatcher = connection.play(ytdl(link, {quality: 'highestaudio'}))
        message.channel.send(this.embed(`Now playing: \n **${title}**`))

        dispatcher.on('finish', () => {
            const manager = this.client.musicManager;

            const queue = manager.queue.get(voiceChannel.id)
            queue.queues.splice(0, 1)

            if(queue.queues.length){
                const nextMusic = queue.queues[0]

                this.playMusic(connection, message, voiceChannel, nextMusic.title, nextMusic.link);
            } else {
                message.channel.send(this.embed('No more queues left. Leaving channel.'))
                voiceChannel.leave()
            }
        })
    }

    embed(message){
        return {embed: {color: 'BLUE', description: message}}
    }
}

module.exports = Play