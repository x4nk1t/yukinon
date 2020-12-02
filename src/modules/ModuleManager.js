const AnimeManager = require('../modules/anime/AnimeManager.js');
const RPGManager = require('../modules/rpg/RPGManager.js');
const EmojiSender = require('../modules/emoji/EmojiSender.js');
const GamesManager = require('../modules/games/GamesManager.js')

class ModuleManager {
    constructor(client){
        this.client = client;
    }
    
    loadAllModules(){
        //if(this.client.devMode) return
        
        this.client.emojiSender = new EmojiSender(this.client)
        this.client.emojiSender.run()
        
        this.client.animeManager = new AnimeManager(this.client)
        this.client.animeManager.run()
        
        this.client.rpgManager = new RPGManager(this.client)
        this.client.rpgManager.run()
        
        this.client.gamesManager = new GamesManager(this.client)
    }
}

module.exports = ModuleManager
