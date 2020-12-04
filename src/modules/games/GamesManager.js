const Coinflip = require('./coinflip/coinflip.js')

class GamesManager {
    constructor(client){
        this.client = client;
        
        this.cmdManager = client.commandManager;
        
        this.loadCommands()
    }
    
    loadCommands(){
        this.cmdManager.loadCommand(new Coinflip(this.cmdManager))
    }
}

module.exports = GamesManager
