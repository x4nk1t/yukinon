const Coinflip = require('./coinflip/coinflip.js')
const EightBall = require('./8ball/eightball.js')

class GamesManager {
    constructor(client){
        this.client = client;
        
        this.cmdManager = client.commandManager;
        
        this.loadCommands()
    }
    
    loadCommands(){
        this.cmdManager.loadCommand(new Coinflip(this.cmdManager))
        this.cmdManager.loadCommand(new EightBall(this.cmdManager))
    }
}

module.exports = GamesManager
