const fetch = require('node-fetch')
const Eris = require('eris')

class AnimeLoader {
    constructor(client){
        this.client = client;
        
        this.apiUrl = 'https://graphql.anilist.co';
        this.episodes = [];
        this.channels = [];
        
        this.status = 0; //0 = Idle & 1 = Need to check new & 2 = checking new anime
    }
    
    async run(){
        this.client.guilds.forEach((value, key) => {
            var release_chan = value.channels.find((channel) => channel.name.toLowerCase() == "releases-all")
            
            if(release_chan instanceof Eris.TextChannel){
                if(!this.channels.some(el => el.id == release_chan.id)){
                    this.channels.push(release_chan)
                }
            }
        })
            
        this.getNewReleases().then(data => {
            this.episodes = data;
            this.status = 0;
            
            setInterval(() => this.checkTask(), 1000)
        }).catch(console.log)
    }
    
    checkTask(){
        if(this.status == 0){
            if(this.episodes.length <= 6) this.status = 1;
            if(this.episodes.length){
                var now = new Date().getTime()
                for(var i = 0; i < 1; i++){
                    var episode = this.episodes[i];
                    var title = episode.title;
                    var url = episode.url;
                    var cover = episode.cover;
                    var airingAt = episode.airingAt;
                    var diff = airingAt - now;
                    
                    if(diff <= 0){
                        this.episodes.splice(i, 1)
                        var embed = {
                            title: 'New episode released!',
                            url: url,
                            color: this.client.embedColor,
                            thumbnail: {url: cover},
                            fields: [
                                {name: 'Title', value: title},
                                {name: 'Episode', value: episode}
                            ],
                            timestamp: new Date(airingAt),
                            footer: {
                                text: 'Might take time to appear on streaming sites.'
                            }
                        }
                        this.channels.forEach(ch => {
                            ch.createMessage({embed: embed})
                        })
                    }
                }
            }
        } else if(this.status == 1){
            this.status = 2;
            
            this.getNewReleases().then(data => {
                this.episodes = data;
                this.status = 0;
            }).catch(console.log)
        }
    }
    
    getNewReleases(){
        return new Promise((resolve, reject) => {
            var query = `{Page{airingSchedules(notYetAired: true){media{id,title {userPreferred}, coverImage{large}, siteUrl},episode,airingAt}}}`;
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
                    const title = media.title.userPreffered;
                    const url = media.siteUrl;
                    const cover = media.coverImage.large;
                    const episode = schedule.episode;
                    const airingAt = schedule.airingAt;
                    
                    array.push({
                        id: id,
                        title: title,
                        episode: episode,
                        url: url,
                        cover: cover,
                        airingAt: (airingAt * 1000)
                    })
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

module.exports = AnimeLoader
