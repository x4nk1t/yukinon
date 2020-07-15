const axios = require('axios');

class ImageGrabber {
    constructor(client){
        this.client = client;
        this.baseUrl = 'https://nekos.life/api/v2';
    }
    
    getImage(endpoint, callback){
        axios(this.baseUrl+endpoint)
            .then(response => callback(response.data.url))
            .catch (error => {
                this.client.logger.error(error)
                callback(null);
            }
        )
    }
}

module.exports = ImageGrabber