const request = require('request');

class ImagesGrabber {
    constructor(client){
        this.client = client;
        this.baseUrl = 'https://nekos.life/api/v2';
    }
    
    getImage(endpoint, callback){
        request(this.baseUrl+endpoint, (err, response, body) => {
            if(!err){
                var json = JSON.parse(body)
                callback(json.url);
            } else {
                this.client.logger.error('Something went wrong: '+ err)
                callback(null);
            }
        })
    }
}

module.exports = ImagesGrabber