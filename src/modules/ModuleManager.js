const AnimeManager = require('./anime/AnimeManager.js');
const RPGManager = require('./rpg/RPGManager.js');
const EmojiSender = require('./emoji/EmojiSender.js');
const GamesManager = require('./games/GamesManager.js');
const MusicManager = require('./musics/MusicManager.js');
const SMMOManager = require('./smmo/SMMOManager.js');

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

        this.client.smmoManager = new SMMOManager(this.client)
        this.client.smmoManager.run()
        
        this.client.gamesManager = new GamesManager(this.client)

        this.client.musicManager = new MusicManager(this.client)
    }
}

module.exports = ModuleManager
