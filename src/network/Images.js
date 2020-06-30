const request = require('request');
const Network = require('./Network.js');

class Images extends Network{
    constructor(bot){
        super(bot, 'https://nekos.life/api/v2');
    }
    
    getImage(endpoint, callback){
        request(this.baseUrl+endpoint, (err, response, body) => {
            if(!err){
                var json = JSON.parse(body)
                callback(json.url);
            } else {
                this.bot.logger.error('Something went wrong: '+ err)
                callback(null);
            }
        })
    }
}

module.exports = Images