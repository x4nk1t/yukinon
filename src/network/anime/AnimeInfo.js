const request = require('request');

class AnimeInfo {
    constructor(client){
        this.client = client;
        this.baseUrl = 'http://api.jikan.moe/v3/anime/';
    }
    
    getDetails(mal_id, callback){
        request(this.baseUrl+mal_id, (err, response, body) => {
            if(!err){
                var json = JSON.parse(body)
                callback(json);
            } else {
                this.client.logger.error('Something went wrong: '+ err)
                callback(null);
            }
        })
    }
}

module.exports = AnimeInfo