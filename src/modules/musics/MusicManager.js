const Discord = require('discord.js');
const Play = require('./cmds/play.js')
const Queue = require('./cmds/queue.js')

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
    }
}

module.exports = MusicManager