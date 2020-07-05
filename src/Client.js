const discord = require('discord.js')
const CommandLoader = require('./utils/CommandLoader.js');
const Logger = require('./utils/Logger.js');
const RandomActivity = require('./utils/RandomActivity.js');

class Client extends discord.Client{
    constructor(options = {}){
        super(options)
        
        this.logger = new Logger(this)
        this.commandLoader = new CommandLoader(this)
        this.randomActivity = new RandomActivity(this)
        
        this.registerEvents()
    }
    
    start(){
        this.randomActivity.run()
        
        this.logger.info('Bot running as: '+ this.user.tag)
    }
    
    registerEvents(){
        this.on('message', message => {
            if(message.author.bot) return;
            
            if(message.content.startsWith(this.commandLoader.prefix)){
                this.commandLoader.execute(message)
            }
        })
        this.on('ready', () => {
            this.start()
        })
    }
}

module.exports = Client