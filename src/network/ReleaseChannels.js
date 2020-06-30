const request = require('request');
const Network = require('./Network.js');

class ReleaseChannels extends Network{
    constructor(bot){
        super(bot, "https://4nk1t.gq/api/bot.php?pass=mys3cr3tk3y&");
    }
    
    add(id, callback = ()=>{}){
        request(this.baseUrl +'addAnimeReleaseChannel=' + id, (err, response, body) => {
            if(!err){
                const parsed = JSON.parse(body);
                callback(parsed)
            } else {
                this.bot.logger.error("Something went wrong: " + err);
            }
        })
    }
    
    remove(id, callback = ()=>{}){
        request(this.baseUrl + 'removeAnimeReleaseChannel=' + id, (err, response, body) => {
            if(!err){
                const parsed = JSON.parse(body);
                callback(parsed)
            } else {
                this.bot.logger.error("Something went wrong: " + err);
            }
        })
    }
}

module.exports = ReleaseChannels;