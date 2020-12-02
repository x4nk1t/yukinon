const axios = require('axios');

class AnimeInfo {
    constructor(client){
        this.client = client;
        this.baseUrl = 'http://api.jikan.moe/v3/anime/';
    }
    
    getDetails(mal_id, callback){
        axios(this.baseUrl+mal_id)
            .then(response => callback(response.data))
            .catch (error => {
                this.client.logger.error(error)
                callback(null);
            }
        )
    }
}

module.exports = AnimeInfo