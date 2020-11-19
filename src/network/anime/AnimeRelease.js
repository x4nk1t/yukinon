const fetch = require('node-fetch')
const Eris = require('eris')

class AnimeRelease {
    constructor(client){
        this.client = client;
        
        this.apiUrl = 'https://graphql.anilist.co';
        this.episodes = [];
    }
    
    async run(){
        await this.getNewReleases().then(data => { this.episodes = data; }).catch(console.log)
        
        if(this.episodes.length) {
            this.setTimeouts()
        } else {
            setTimeout(() => this.run(), 300000) //5min
        }
    }
    
    setTimeouts(){
        this.episodes.forEach(episode => {
            var now = new Date().getTime()
            var title = episode.title;
            var url = episode.url;
            var episode_num = episode.episode;
            var cover = episode.cover;
            var airingAt = episode.airingAt;
            var difference = airingAt - now;
            
            if(difference > 0){
                setTimeout(() => {
                    var embed = {
                        title: 'New episode got released!',
                        color: 'BLUE',
                        thumbnail: {url: cover},
                        fields: [
                            {name: 'Title', value: title, inline: true},
                            {name: 'Episode', value: episode_num, inline: true},
                            {name: 'AniList', value: url}
                        ],
                        timestamp: new Date(),
                    }
                    
                    this.client.channels.cache.filter(channel => channel.name == 'releases-all').each((channel, key) => {
                        if(channel.type == 'text'){
                            channel.send({embed: embed}).catch(console.log)
                        }
                    })
                }, difference)
            }
        })
    }
    
    getNewReleases(){
        return new Promise((resolve, reject) => {
            var query = `{Page{airingSchedules(notYetAired: true){media{id,title {userPreferred}, coverImage{large}, countryOfOrigin, siteUrl},episode,airingAt}}}`;
            var options = this.optionBuilder({query: query})
            this.sendRequest(options, (err, data) => {
                if(err){
                    reject(data)
                    return
                }
                const {airingSchedules} = data.data.Page;
                var array = []
                
                for(var i = 0; i < airingSchedules.length; i++){
                    const schedule = airingSchedules[i];
                    const media = schedule.media;
                    const id = media.id;
                    const title = media.title.userPreferred;
                    const url = media.siteUrl;
                    const cover = media.coverImage.large;
                    const countryOfOrigin = media.countryOfOrigin;
                    const episode = schedule.episode;
                    const airingAt = schedule.airingAt;
                    
                    if(countryOfOrigin == "JP"){
                        array.push({
                            id: id,
                            title: title,
                            episode: episode,
                            url: url,
                            cover: cover,
                            airingAt: (airingAt * 1000)
                        })
                    }
                }
                resolve(array)
            })
        })
    }
    
    sendRequest(options, callback = () => {}){
        fetch(this.apiUrl, options).then(response => response.json()).then(data => {
            callback(false, data)
        }).catch(err => {
            console.log(err)
            callback(true, err)
        })
    }
    
    optionBuilder(object){
        var options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(object)
        }
        
        return options;
    }
}

module.exports = AnimeRelease
