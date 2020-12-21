const Command = require('../../../utils/Command.js')
const ytdl = require('ytdl-core');

class Play extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'play',
            description: 'Play music.',
            usage: '[yt link]',
            aliases: ['p'],
            guildOnly: true
        })
    }

    async execute(message, commandArgs){
        const member = message.member;
        const manager = this.client.musicManager;

        if(member.voice.channel){
            const voiceChannel = member.voice.channel;
            const bot_vc = message.guild.member(this.client.user).voice.channel;

            if(!commandArgs[0]){
                const connection = message.guild.voice.connection;
                if(connection){
                    const dispatcher = connection.dispatcher;
                    if(dispatcher.paused){
                        dispatcher.resume();
                        message.channel.send(this.embed('Music resumed.'))
                    } else {
                        message.channel.send(this.embed('Music is currently playing. Use `'+ this.prefix + this.options.name +' '+ this.options.usage +'` to add song to queue.'))
                    }
                } else { 
                    this.sendUsage(message)
                    return
                }
            } else {
                var query = commandArgs[0];

                if(!bot_vc || bot_vc.id == voiceChannel.id){
                    if(query.startsWith('https://') || query.startsWith('http://')){
                        if(ytdl.validateURL(query)){
                            var info = await ytdl.getBasicInfo(query)
                            var music = info.player_response.videoDetails
                            var length = music.lengthSeconds;
                            var thumbnail = music.thumbnail.thumbnails[music.thumbnail.thumbnails.length - 1].url;

                            voiceChannel.join().then(connection => {
                                if(manager.queue.get(voiceChannel.id)){
                                    var queue = manager.queue.get(voiceChannel.id)
                                    queue.queues.push({title: music.title, link: query, length: length, thumbnail: thumbnail})
                                    if(queue.queues.length){
                                        message.channel.send(this.embed(`Added **${music.title}** to queue.`))
                                    } else {
                                        manager.playMusic(connection, message, voiceChannel, music.title, query, length)
                                    }
                                } else {
                                    manager.queue.set(voiceChannel.id, {queues: [{title: music.title, link: query, length: length, thumbnail: thumbnail}]})
                                    manager.playMusic(connection, message, voiceChannel, music.title, query)
                                }
                            })
                        } else {
                            message.channel.send(this.embed('Link is not valid.'))
                        }
                    } else {
                        const video = await manager.searchYoutube(query)

                        if(videoId == null){
                            message.channel.send(this.embed('Video not found with the query.'))
                        } else {
                            const videoId = video.videoId;
                            const link = 'https://www.youtube.com/watch?v='+ videoId;

                            var info = await ytdl.getBasicInfo(videoId)
                            var music = info.player_response.videoDetails
                            var length = music.lengthSeconds;
                            var thumbnail = music.thumbnail.thumbnails[music.thumbnail.thumbnails.length - 1].url;

                            voiceChannel.join().then(connection => {
                                if(manager.queue.get(voiceChannel.id)){
                                    var queue = manager.queue.get(voiceChannel.id)
                                    queue.queues.push({title: music.title, link: link, length: length, thumbnail: thumbnail})
                                    if(queue.queues.length){
                                        message.channel.send(this.embed(`Added **${music.title}** to queue.`))
                                    } else {
                                        manager.playMusic(connection, message, voiceChannel, music.title, link, length)
                                    }
                                } else {
                                    manager.queue.set(voiceChannel.id, {queues: [{title: music.title, link: link, length: length, thumbnail: thumbnail}]})
                                    manager.playMusic(connection, message, voiceChannel, music.title, link)
                                }
                            })
                        }
                    }
                } else {
                    message.channel.send(this.embed('Bot is already connected to `'+ voiceChannel.name +'`.'))
                }
            }
        } else {
            message.channel.send(this.embed('You must be connected to voice channel.'))
        }
    }

    embed(message){
        return {embed: {color: 'BLUE', description: message}}
    }
}

module.exports = Play