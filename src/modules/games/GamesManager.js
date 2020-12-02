const Coinflip = require('./coinflip/coinflip.js')
const BlackJack = require('./blackjack/blackjack.js')

class GamesManager {
    constructor(client){
        this.client = client;
        
        this.cmdManager = client.commandManager;
        
        this.loadCommands()
    }
    
    loadCommands(){
        this.cmdManager.loadCommand(new Coinflip(this.cmdManager))
        this.cmdManager.loadCommand(new BlackJack(this.cmdManager))
    }
}

module.exports = GamesManager
