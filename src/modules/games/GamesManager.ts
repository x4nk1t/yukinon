import Client from "../../Client";
import CommandManager from "../../CommandManager";

import Coinflip from './coinflip/coinflip';
import EightBall from './8ball/eightball';

class GamesManager {
    client: Client;
    commandManager: CommandManager;

    constructor(client: Client){
        this.client = client;
        
        this.commandManager =  client.commandManager;
        
        this.loadCommands()
    }
    
    loadCommands(){
        this.commandManager.loadCommand(new Coinflip(this.commandManager))
        this.commandManager.loadCommand(new EightBall(this.commandManager))
    }
}

export default GamesManager;
