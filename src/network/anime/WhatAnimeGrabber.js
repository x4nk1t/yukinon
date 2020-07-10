const request = require('request');

class WhatAnimeGrabber {
    constructor(client){
        this.client = client;
        this.baseUrl = 'https://trace.moe/api/search?url=';
    }
    
    getDetails(url, callback){
        request(this.baseUrl+url, (err, response, body) => {
            if(!err){
                if(body.startsWith('"Search limit exceeded.')){
                    callback(null)
                    return
                }
                var json = JSON.parse(body)
                callback(json);
            } else {
                this.client.logger.error('Something went wrong: '+ err)
                callback(null);
            }
        })
    }
}

module.exports = WhatAnimeGrabber