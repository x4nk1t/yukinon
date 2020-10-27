const Eris = require('eris')
const mongoose = require('mongoose')

const CommandLoader = require('./commands/CommandLoader.js');
const DBApi = require('./network/database/DBApi.js');
const Logger = require('./utils/Logger.js');
const AnimeRelease = require('./network/anime/AnimeRelease.js');
const RPGReminder = require('./utils/RPGReminder.js')

const url = process.env.DB_URL;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

class Client extends Eris.CommandClient{
    constructor(token, options = {}){
        var commandOptions = {
            prefix: [],
            description: 'A custom made bot'
        }
        
        if(process.env.DEVMODE) commandOptions.prefix.push('!!'); else commandOptions.prefix.push('!');
        super(token, options, commandOptions)
        
        this.devMode = process.env.DEVMODE;
        
        this.logger = new Logger(this)
        this.commandLoader = new CommandLoader(this)
        this.dbapi = new DBApi(this)
        this.animeRelease = new AnimeRelease(this)
        this.db = mongoose.connection;
        this.rpgReminder = new RPGReminder(this)
        
        this.embedColor = 3583967;
        this.embedRedColor = 16711680;
        this.embedGreenColor = 65280;
        
        this.db.on('error', err => this.logger.error(err))
        this.db.once('open', () => this.logger.info('Connected to database'))
        
        this.registerEvents()
    }
    
    start(){
        if(!this.devMode){
            this.animeRelease.run()
            this.rpgReminder.run()
        } else {
            this.logger.info('Bot is running on development mode. Some features are disabled.')
        }
        
        this.logger.info('Bot running as: '+ this.user.username +'#'+ this.user.discriminator)
    }
    
    registerEvents(){
        this.on('messageCreate', message => {
            if(message.author.bot) return;
            
            if(message.content.toLowerCase().startsWith('rpg')){
                if(!this.devMode){
                    this.rpgReminder.execute(message)
                }
            }
        })
        this.on('ready', () => {
            this.start()
        })
        /*this.on('channelDelete', channel => {
            if(!this.devMode) this.dbapi.removeReleaseChannel(channel, () => {})
        })*/
        this.on('error', console.log)
    }
}

module.exports = Client
global.mongoose = mongoose;
