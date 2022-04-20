import { Message, Client as DiscordClient, ClientOptions} from "discord.js";
import mongoose from 'mongoose';

import Logger from './utils/Logger';
import CommandManager from './CommandManager';
import AnimeManager from "./modules/anime/AnimeManager";
import EmojiSender from "./modules/emoji/EmojiSender";
import GamesManager from "./modules/games/GamesManager";
import JoinLeaveManager from "./modules/joinleave/JoinLeaveManager";
import LevelingManager from "./modules/leveling/LevelingManager";
import ReminderManager from "./modules/reminders/ReminderManager";
import RPGManager from "./modules/rpg/RPGManager";
import TacoManager from "./modules/taco/TacoManager";

mongoose.connect(String(process.env.DB_URL));// + '?userNewUrlParser=true&useUnifiedTopology=true')

class Client extends DiscordClient{
    devMode: boolean;
    logger: Logger;
    commandManager: CommandManager;
    db: mongoose.Connection;
    authorizedUsers: Array<String>;
    owners: Array<String>;
    emojiSender!: EmojiSender;
    animeManager!: AnimeManager;
    rpgManager!: RPGManager;
    tacoManager!: TacoManager;
    gamesManager!: GamesManager;
    reminderManager!: ReminderManager;
    joinLeaveManager!: JoinLeaveManager;
    levelingManager!: LevelingManager;

    constructor(options: ClientOptions){
        super(options)
        
        this.devMode = Boolean(process.env.DEVMODE);
        
        this.logger = new Logger(this)
        this.commandManager = new CommandManager(this)
        
        this.db = mongoose.connection;
        
        this.db.on('error', (err: any) => this.logger.error(err));
        this.db.once('open', () => this.logger.info('Connected to database'))

        this.authorizedUsers = ['620152697450135552', '505715662652702747'];
        this.owners = ['620152697450135552'];

        this.registerEvents();
    }
    
    start(){
        this.commandManager.run();
        this.loadAllModules();
        this.logger.info('Bot running as: '+ this.user?.tag);
    }
    
    registerEvents(){
        this.on('ready', () => this.start());
        
        this.on('messageCreate', (message: Message) => {
            if(message.author.bot) return;
            
            if(message.content.toLowerCase().startsWith(this.commandManager.prefix)){
                this.commandManager.execute(message);
            }
        })
        
        this.on('error', (err: any) => this.logger.error(err));
    }

    loadAllModules(){
        this.emojiSender = new EmojiSender(this);
        this.animeManager = new AnimeManager(this);
        this.rpgManager = new RPGManager(this);
        this.tacoManager = new TacoManager(this);
        this.gamesManager = new GamesManager(this);
        this.reminderManager = new ReminderManager(this);
        this.joinLeaveManager = new JoinLeaveManager(this);
        this.levelingManager = new LevelingManager(this);
    }
}

export default Client;
