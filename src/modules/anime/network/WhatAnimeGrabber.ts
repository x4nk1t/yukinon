import axios from 'axios';
import Client from '../../../Client';

class WhatAnimeGrabber {
    client: Client;
    baseUrl: string;
    
    constructor(client: Client){
        this.client = client;
        this.baseUrl = 'https://api.trace.moe/search?url=';
    }
    
    getDetails(url: string | undefined, callback = (err: boolean, response: any) => {}){
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

export default WhatAnimeGrabber
