import Client from "../../../Client";

import axios from 'axios';
import AnimeManager from "../AnimeManager";

class AnimeInfo {
    client: Client;
    constructor(client: Client){
        this.client = client;
    }
    
    getDetails(anilist_id: any, callback: (response: any) => void){
        const manager: AnimeManager = this.client.animeManager!;

        const query = `query($id: Int){Media(id: $id){id,idMal,title {english, romaji},coverImage {extraLarge},source,episodes,status,meanScore,siteUrl}}`

        const options = <any>manager.optionBuilder({query: query, variables: {id: anilist_id}})

        manager.sendRequest(options, (err: string, data: any) => {
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

export default AnimeInfo;