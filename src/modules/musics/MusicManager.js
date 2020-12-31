const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const axios = require('axios');

const Play = require('./cmds/play.js')
const Queue = require('./cmds/queue.js')
const Leave = require('./cmds/leave.js')
const Volume = require('./cmds/volume.js')
const Pause = require('./cmds/pause.js')
const Next = require('./cmds/next.js')
const NowPlaying = require('./cmds/now-playing.js');

class MusicManager {
    constructor(client){
        this.client = client;
        
        this.cmdManager = client.commandManager;
        
        this.queue = new Discord.Collection();

        this.loadCommands()
    }
    
    loadCommands(){
        this.cmdManager.loadCommand(new Play(this.cmdManager))
        this.cmdManager.loadCommand(new Queue(this.cmdManager))
        this.cmdManager.loadCommand(new Leave(this.cmdManager))
        this.cmdManager.loadCommand(new Volume(this.cmdManager))
        this.cmdManager.loadCommand(new Pause(this.cmdManager))
        this.cmdManager.loadCommand(new Next(this.cmdManager))
        this.cmdManager.loadCommand(new NowPlaying(this.cmdManager))
    }

    searchYoutube(query){
        return new Promise((resolve, reject) => {
            const url = 'https://youtube.com/results?search_query='+ encodeURI(query);

            axios.get(url)
                .then(response => {
                    const data = response.data;
                    const start = data.indexOf('ytInitialData') + 'ytInitialData'.length + 3;
                    const end = data.indexOf('};', start) + 1;
                    const json = data.substring(start, end);
                    const parse = JSON.parse(json);
                    const contents = parse.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
                    
                    if(contents.length){
                        const video = contents[0].videoRenderer || contents[1].videoRenderer;

                        resolve(video)
                    } else {
                        resolve(null);
                    }
                }).catch(err => {
                    this.client.logger.error(err)
                    reject(err)
                })
        })
    }

    playMusic(connection, message, voiceChannel, title, link){
        const dispatcher = connection.play(ytdl(link, {quality: 'highestaudio'}))
        const queue = this.queue.get(voiceChannel.id)
        const volume = queue.volume ? queue.volume : 1;

        dispatcher.setVolume(volume)
        message.channel.send(this.embed(`Now playing: \n **${title}**`))

        dispatcher.on('finish', () => {
            const queue = this.queue.get(voiceChannel.id)
            queue.queues.splice(0, 1)

            if(queue.queues.length){
                const nextMusic = queue.queues[0]

                this.playMusic(connection, message, voiceChannel, nextMusic.title, nextMusic.link);
            } else {
                if(this.queue.get(voiceChannel.id)) this.queue.delete(voiceChannel.id)
                
                message.channel.send(this.embed('No more queues left. Leaving channel.'))
                voiceChannel.leave()
            }
        })
    }
    
    embed(message){
        return {embed: {color: 'BLUE', description: message}}
    }
}

module.exports = MusicManager