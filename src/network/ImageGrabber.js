const fetch = require('node-fetch');

class ImageGrabber {
    constructor(client){
        this.client = client;
        this.baseUrl = 'https://nekos.life/api/v2';
    }
    
    getImage(endpoint, callback){
        fetch(this.baseUrl+endpoint)
            .then(response => response.json())
            .then(data => callback(data.url))
            .catch (error => {
                this.client.logger.error(error)
                callback(null);
            }
        )
    }
}

module.exports = ImageGrabber