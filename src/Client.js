const Discord = require('discord.js')
const mongoose = require('mongoose')

const CommandLoader = require('./commands/CommandLoader.js');
const DBApi = require('./network/database/DBApi.js');
const Logger = require('./utils/Logger.js');
const AnimeRelease = require('./network/anime/AnimeRelease.js');
const RPGReminder = require('./utils/RPGReminder.js')
const EmojiSender = require('./utils/EmojiSender.js')

const url = process.env.DB_URL;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

class Client extends Discord.Client{
    constructor(options = {}){
        super(options)
        
        this.devMode = process.env.DEVMODE;
        
        this.logger = new Logger(this)
        this.commandLoader = new CommandLoader(this)
        //this.dbapi = new DBApi(this)
        this.animeRelease = new AnimeRelease(this)
        this.db = mongoose.connection;
        this.rpgReminder = new RPGReminder(this)
        this.emojiSender = new EmojiSender(this)
        
        this.db.on('error', err => this.logger.error(err))
        this.db.once('open', () => this.logger.info('Connected to database'))
        
        this.registerEvents()
    }
    
    start(){
        if(!this.devMode){
            this.emojiSender.run()
            this.animeRelease.run()
            this.rpgReminder.run()
        } else {
            this.logger.info('Bot is running on development mode. Some features are disabled.')
        }
        
        this.logger.info('Bot running as: '+ this.user.username +'#'+ this.user.discriminator)
    }
    
    registerEvents(){
        this.on('ready', () => {
            if(!this.alreadyReady){
                this.start()
                this.alreadyReady = true;
            } else {
                this.logger.info('Ready triggered!!')
            }
        })
        
        this.on('message', message => {
            if(message.author.bot) return
            
            if(message.content.toLowerCase().startsWith(this.commandLoader.prefix)){
                this.commandLoader.execute(message)
            }
        })
        
        /*this.on('channelDelete', channel => {
            if(!this.devMode) this.dbapi.removeReleaseChannel(channel, () => {})
        })*/
        this.on('error', err => this.logger.error(err))
    }
}

module.exports = Client
global.mongoose = mongoose;
