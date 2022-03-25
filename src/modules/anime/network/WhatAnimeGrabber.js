const axios = require('axios');

class WhatAnimeGrabber {
    constructor(client){
        this.client = client;
        this.baseUrl = 'https://api.trace.moe/search?url=';
    }
    
    getDetails(url, callback){
        axios(this.baseUrl+url)
            .then(response => {
                const data = response.data;
                callback(false, data)
            })
            .catch (error => {
                if(error.response.status == 429){
                    callback(true, {message: 'Rate limited. Try again in 60 seconds'});
                } else {
                    callback(true, {message: 'Something went wrong. Try again later'});
                }
            }
        )
    }
}

module.exports = WhatAnimeGrabber
