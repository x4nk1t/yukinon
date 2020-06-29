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
        
        this.startTime = new Date().getTime();
        this.registerEvents()
    }
    
    start(){
        this.animeScarper.grabLastMessage()
        this.randomActivity.run()
        
        this.logger.info('Bot running as: '+ this.client.user.tag)
    }
    
    registerEvents(){
        this.client.on('message', async message => {
            if(message.author.bot) return;
            
            if(message.content.startsWith(this.commandLoader.prefix)){
                this.commandLoader.execute(message)
            }
        })
        
        this.client.on('channelDelete', channel => {
            const channelId = channel.id;
            
            this.releaseChannels.remove(channelId)
        })
    }
}

module.exports = BotServer