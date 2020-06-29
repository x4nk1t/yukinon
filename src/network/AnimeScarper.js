const request = require('request')
const cheerio = require('cheerio')
const EmbedBuilder = require('../utils/EmbedBuilder.js')
const Network = require('./Network.js')

class AnimeScarper extends Network{
    constructor(server){
        super(server, 'https://www19.gogoanime.io');
        
        this.lastSync = [];
        this.animeReleaseChannels = [];
        this.username = this.client.user.username;
        this.baseAnimeUrl = 'https://4nk1t.gq/api/anime.php?pass=mys3cr3tk3y&username='+this.username;
        this.baseBotUrl = 'https://4nk1t.gq/api/bot.php?pass=mys3cr3tk3y&username='+this.username;
    }
    
    grabLastMessage(){
        request(this.baseBotUrl +'&getAnimeReleaseChannels', (err, response, body) => {
            if(!err){
                this.animeReleaseChannels = JSON.parse(body);
                this.server.logger.info("Anime release channels loaded.");
                
                request(this.baseAnimeUrl +'&get', (err, response, body) => {
                    if(!err){
                        if(body == '') body = '[]';
                        this.lastSync = JSON.parse(body);
                        this.run()
                        setInterval(() => this.run(), 1000 * 60 * 17)
                        this.server.logger.info("Anime Sync Loaded.");
                    } else {
                        this.server.logger.error("Something went wrong: " + err);
                    }
                })
            } else {
                this.server.logger.error("Something went wrong: " + err);
            }
        })
    }
    
    syncLastMessage(){
        var options = {
            url: this.baseAnimeUrl,
            method: 'POST',
            json: this.lastSync
        };
        request(options, (err, response, body) => {
            if(!err){
                if(body.status == 0){
                    this.server.logger.info("Sync success.");
                } else {
                    this.server.logger.error("Something went wrong while syncing.");
                }
            } else {
                 this.server.logger.error("Something went wrong:" + err)
            }
        })
    }
    
    run(){
        request(this.baseUrl, (err, response, body) => {
            if(err){
                this.server.logger.error("Something went wrong:" + err)
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
            
            for(var j = 0; j < this.animeReleaseChannels.length; j++){
                var chh = this.client.channels.cache.get(this.animeReleaseChannels[j]);
                if(chh != null) chh.send(embed);
            }
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