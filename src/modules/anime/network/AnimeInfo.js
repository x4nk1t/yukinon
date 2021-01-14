const axios = require('axios');

class AnimeInfo {
    constructor(client){
        this.client = client;
    }
    
    getDetails(anilist_id, callback){
        const manager = this.client.animeManager;

        const query = `query($id: Int){Media(id: $id){id,title {userPreferred},coverImage {extraLarge},source,episodes,status,meanScore,siteUrl}}`

        const options = manager.optionBuilder({query: query, variables: {id: anilist_id}})

        manager.sendRequest(options, (err, data) => {
            if(err){
                this.client.logger.error(err)
                callback(null)
                return
            }
            
            if(data.errors){
                callback(null)
            } else {
                callback(data.data.Media)
            }
        })
    }
}

module.exports = AnimeInfo