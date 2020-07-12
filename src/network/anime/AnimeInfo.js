const fetch = require('node-fetch');

class AnimeInfo {
    constructor(client){
        this.client = client;
        this.baseUrl = 'http://api.jikan.moe/v3/anime/';
    }
    
    getDetails(mal_id, callback){
        fetch(this.baseUrl+mal_id)
            .then(response => response.json())
            .then(data => callback(data))
            .catch (error => {
                this.client.logger.error(error)
                callback(null);
            }
        )
    }
}

module.exports = AnimeInfo