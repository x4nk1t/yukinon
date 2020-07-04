const CommandLoader = require('./utils/CommandLoader.js');
const Logger = require('./utils/Logger.js');
const RandomActivity = require('./utils/RandomActivity.js');

class Bot {
    constructor(client){
        this.client = client;
        this.logger = new Logger(this);
        this.commandLoader = new CommandLoader(this)
        this.randomActivity = new RandomActivity(this)
        
        this.registerEvents()
    }
    
    start(){
        this.randomActivity.run()
        
        this.logger.info('Bot running as: '+ this.client.user.tag)
    }
    
    registerEvents(){
        this.client.on('message', message => {
            if(message.author.bot) return;
                        
            if(message.content.startsWith(this.commandLoader.prefix)){
                this.commandLoader.execute(message)
            }
        })
    }
}

module.exports = Bot