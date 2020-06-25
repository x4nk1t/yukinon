const AnimeScarper = require('./network/AnimeScarper.js');
const CommandLoader = require('./commands/CommandLoader.js');
const Logger = require('./utils/Logger.js');
const RandomActivity = require('./utils/RandomActivity.js');

class BotServer {
    constructor(client){
        this.client = client;
        this.logger = new Logger(this);
        this.commandLoader = new CommandLoader(this)
        this.animeScarper = new AnimeScarper(this)
        this.randomActivity = new RandomActivity(this)
    }
    
    start(){
        this.animeScarper.grabLastMessage()
        this.randomActivity.run()
        
        this.logger.info('Bot running as: '+ this.client.user.tag)
    }
}

module.exports = BotServer