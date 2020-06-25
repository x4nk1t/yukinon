const request = require('request')
const cheerio = require('cheerio')
const discord = require('discord.js')
const EmbedBuilder = require('../utils/EmbedBuilder.js')

class AnimeScarper {
    constructor(client){
        this.lastSync = [];
        this.baseUrl = 'https://www19.gogoanime.io';
        this.client = client;
    }
    
    grabLastMessage(){
        request('https://4nk1t.gq/anime.php?pass=mys3cr3tk3y&get', (err, response, body) => {
            if(!err){
                this.lastSync = JSON.parse(JSON.parse(body));
                this.run()
                setInterval(() => this.run(), 1000 * 60 * 17)
                console.log("[INFO] Grab success.");
            } else {
                console.log("[ERROR] Something went wrong: " + err);
            }
        })
    }
    
    syncLastMessage(){
        var toSend = JSON.stringify(this.lastSync);
        var options = {
            url: 'https://4nk1t.gq/anime.php?pass=mys3cr3tk3y',
            method: 'POST',
            json: toSend
        };
        request(options, (err, response, body) => {
            if(!err){
                if(body == "ok"){
                    console.log("[INFO] Sync success.");
                } else {
                    console.log("[ERROR] Something went wrong while syncing.");
                }
            } else {
                 console.log("[ERROR] Something went wrong:" + err)
            }
        })
    }
    
    run(){
        request(this.baseUrl, (err, response, body) => {
            if(err){
                console.log("[ERROR] Something went wrong:" + err)
            } else {
                var $ = cheerio.load(body)
                
                var img = $('.last_episodes .items li .img')
                var episode = $('.last_episodes .items li .episode')
                var details = [];
                var j = 0;
                
                for(var i = (img.length - 1); i >= 0; i--){
                    var imgUrl = img[i].children[1].children[1].attribs.src;
                    var animeName = img[i].children[1].children[1].attribs.alt;
                    var episodeNum = episode[i].children[0].data;
                    var episodeUrl = img[i].children[1].attribs.href;
                    
                    details[j] = {};
                    details[j].imageUrl = imgUrl;
                    details[j].animeName = animeName;
                    details[j].episodeNum = episodeNum;
                    details[j].episodeUrl = this.baseUrl + episodeUrl;
                    j++;
                }
                var newEpisodes = this.checkNewEpisode(details);
                this.sendToChannel(newEpisodes);
            }
        })
    }
    
    sendToChannel(newEpisodes){
        for(var i = 0; i < newEpisodes.length; i++){
            var embed = new EmbedBuilder().build()
                .setTitle("New Anime just got released!")
                .setThumbnail(newEpisodes[i].imageUrl)
                .addFields(
                    {name: "Anime Name:", value: newEpisodes[i].animeName},
                    {name: "Episode:", value: newEpisodes[i].episodeNum},
                    {name: "Episode Link:", value: newEpisodes[i].episodeUrl}
                )
                .setTimestamp()
                
            this.client.channels.cache.get('725243560236154980').send(embed); //TODO: Make this load from my site
        }
    }
    
    checkNewEpisode(newSync){
        var newSyncCopy = [...newSync];
        for(var i = this.lastSync.length - 1; i >= 0; i--){
            for(var j = 0; j < newSync.length; j++){
                if(this.lastSync[i].animeName == newSync[j].animeName){
                    newSync.splice(j, 1)
                }
            }
        }
        this.lastSync = newSyncCopy;
        if(newSync.length != 0){
            this.syncLastMessage();
        }
        return newSync;
    }
}

module.exports = AnimeScarper