const AnimeScarper = require('./network/AnimeScarper.js');
const CommandLoader = require('./commands/CommandLoader.js');
const Logger = require('./utils/Logger.js');
const RandomActivity = require('./utils/RandomActivity.js');

const request = require('request');

class BotServer {
    constructor(client){
        this.client = client;
        this.logger = new Logger(this);
        this.commandLoader = new CommandLoader(this)
        this.animeScarper = new AnimeScarper(this)
        this.randomActivity = new RandomActivity(this)
        
        this.baseUrl = "https://4nk1t.gq/api/bot.php?pass=mys3cr3tk3y&";
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
                this.commandLoader.onCommand(message)
            }
        })
        
        this.client.on('channelDelete', channel => {
            const channelId = channel.id;
            
            this.removeChannel(channelId)
        })
    }
    
    addChannelToAnimeRelease(id, callback = ()=>{}){
        request(this.baseUrl +'addAnimeReleaseChannel=' + id, (err, response, body) => {
            if(!err){
                const parsed = JSON.parse(body);
                callback(parsed)
            } else {
                this.logger.error("Something went wrong: " + err);
            }
        })
    }
    
    removeChannelFromAnimeRelease(id, callback = ()=>{}){
        request(this.baseUrl + 'removeAnimeReleaseChannel=' + id, (err, response, body) => {
            if(!err){
                const parsed = JSON.parse(body);
                callback(parsed)
            } else {
                this.logger.error("Something went wrong: " + err);
            }
        })
    }
}

module.exports = BotServer