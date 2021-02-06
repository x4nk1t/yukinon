const Discord = require('discord.js')
const mongoose = require('mongoose')

const Logger = require('./utils/Logger.js');
const CommandManager = require('./CommandManager.js');
const ModuleManager = require('./modules/ModuleManager.js');

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})

class Client extends Discord.Client{
    constructor(options = {}){
        super(options)
        
        this.devMode = process.env.DEVMODE;
        
        this.logger = new Logger(this)
        this.commandManager = new CommandManager(this)
        this.moduleManager = new ModuleManager(this)
        
        this.db = mongoose.connection;
        
        this.db.on('error', err => this.logger.error(err))
        this.db.once('open', () => this.logger.info('Connected to database'))
        
        this.registerEvents()
    }
    
    start(){
        this.commandManager.run()
        this.moduleManager.loadAllModules()
        this.logger.info('Bot running as: '+ this.user.tag)
    }
    
    registerEvents(){
        this.on('ready', () => this.start())
        
        this.on('message', message => {
            if(message.author.bot) return
            
            if(message.content.toLowerCase().startsWith(this.commandManager.prefix)){
                this.commandManager.execute(message)
            }
        })
        
        this.on('error', err => this.logger.error(err))
    }
}

module.exports = Client
global.mongoose = mongoose;
