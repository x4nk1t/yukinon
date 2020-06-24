const request = require('request')
const cheerio = require('cheerio')
const discord = require('discord.js')

class AnimeScarper {
    constructor(client){
        this.lastSync = [];
        this.baseUrl = 'https://www19.gogoanime.io';
        this.client = client;
        this.colorArray = [
          '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
    }
    
    grabLastMessage(){
        request('https://4nk1t.gq/anime.php?pass=mys3cr3tk3y&get', (err, response, body) => {
            if(!err){
                this.lastSync = JSON.parse(JSON.parse(body));
                this.run()
                setInterval(() => this.run(), 1000 * 60 * 15)
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
            var embed = new discord.MessageEmbed()
                .setColor(this.colorArray[Math.floor(Math.random() * this.colorArray.length)])
                .setTitle("New Anime just got released!")
                .setThumbnail(newEpisodes[i].imageUrl)
                .addFields(
                    {name: "Anime Name:", value: newEpisodes[i].animeName},
                    {name: "Episode:", value: newEpisodes[i].episodeNum},
                    {name: "Episode Link:", value: newEpisodes[i].episodeUrl}
                )
                .setTimestamp()
                
            this.client.channels.cache.get('725243560236154980').send(embed);
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
        this.syncLastMessage();
        return newSync;
    }
}

module.exports = AnimeScarper