const AnimeManager = require('./anime/AnimeManager.js');
const RPGManager = require('./rpg/RPGManager.js');
const EmojiSender = require('./emoji/EmojiSender.js');
const GamesManager = require('./games/GamesManager.js');
const SMMOManager = require('./smmo/SMMOManager.js');
const TacoManager = require('./taco/TacoManager.js');
const ReminderManager = require('./reminders/ReminderManager.js');

const AddReactionsMudae = require('./add-reactions.js');

class ModuleManager {
    constructor(client){
        this.client = client;
    }
    
    loadAllModules(){
        //if(this.client.devMode) return
        
        this.client.emojiSender = new EmojiSender(this.client)
        
        this.client.animeManager = new AnimeManager(this.client)
        
        this.client.rpgManager = new RPGManager(this.client)

        this.client.tacoManager = new TacoManager(this.client)

        this.client.smmoManager = new SMMOManager(this.client)
        
        this.client.gamesManager = new GamesManager(this.client)

        this.client.reminderManager = new ReminderManager(this.client)

        this.client.addReactionsMudae = new AddReactionsMudae(this.client)
    }
}

module.exports = ModuleManager
