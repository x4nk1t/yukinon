const fetch = require('node-fetch');

class WhatAnimeGrabber {
    constructor(client){
        this.client = client;
        this.baseUrl = 'https://trace.moe/api/search?url=';
    }
    
    getDetails(url, callback){
        fetch(this.baseUrl+url)
            .then(response => response.text())
            .then(data => {
                if(data.startsWith('"Search limit exceeded.') || data.startsWith('"Error reading')){
                    callback(null);
                } else {
                    callback(JSON.parse(data))
                }
            })
            .catch (error => {
                this.client.logger.error(error)
                callback(null);
            }
        )
    }
}

module.exports = WhatAnimeGrabber