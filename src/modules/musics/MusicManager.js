const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const Play = require('./cmds/play.js')
const Queue = require('./cmds/queue.js')
const Leave = require('./cmds/leave.js')
const Volume = require('./cmds/volume.js')
const Pause = require('./cmds/pause.js')
const Next = require('./cmds/next.js')
const NowPlaying = require('./cmds/now-playing.js')

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

module.exports = MusicManager