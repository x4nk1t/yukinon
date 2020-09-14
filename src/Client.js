const discord = require('discord.js')
const mongoose = require('mongoose')

const CommandLoader = require('./commands/CommandLoader.js');
const DBApi = require('./network/database/DBApi.js');
const Logger = require('./utils/Logger.js');
const AnimeRelease = require('./network/anime/AnimeRelease.js');
const RPGReminder = require('./utils/RPGReminder.js')

const url = process.env.DB_URL;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

class Client extends discord.Client{
    constructor(options = {}){
        super(options)
        
        this.logger = new Logger(this)
        this.commandLoader = new CommandLoader(this)
        this.dbapi = new DBApi(this)
        this.animeRelease = new AnimeRelease(this)
        this.db = mongoose.connection;
        this.rpgReminder = new RPGReminder(this)
        
        this.registerEvents()
        
        this.db.on('error', err => this.logger.error(err))
        this.db.once('open', () => this.logger.info('Connected to database'))
    }
    
    start(){
        this.animeRelease.run()
        this.rpgReminder.run()
        
        this.logger.info('Bot running as: '+ this.user.tag)
    }
    
    registerEvents(){
        this.on('message', message => {
            if(message.author.bot) return;
            
            if(message.content.toLowerCase().startsWith(this.commandLoader.prefix)){
                this.commandLoader.execute(message)
            }
            
            if(message.content.toLowerCase().startsWith('rpg')){
                this.rpgReminder.execute(message)
            }
        })
        this.on('ready', () => {
            this.start()
        })
        this.on('channelDelete', channel => {
            this.dbapi.removeReleaseChannel(channel, () => {})
        })
    }
}

module.exports = Client
global.mongoose = mongoose;