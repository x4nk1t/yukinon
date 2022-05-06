import { Message, PermissionResolvable } from "discord.js";
import Client from "../Client";
import CommandManager from "../CommandManager";

export interface CommandInterface {
    name: string;
    description: string;
    aliases: Array<string>;
    usage?: string;
    enabled?: boolean;
    showInHelp?: boolean;
    permissions?: Array<PermissionResolvable>;
}

abstract class Command {
    commandManager: CommandManager;
    client: Client;
    prefix: string;
    name: string;
    description: string;
    aliases: Array<string>;
    usage?: string;
    enabled?: boolean;
    showInHelp?: boolean;
    permissions?: Array<PermissionResolvable>;

    constructor(commandManager: CommandManager, options: CommandInterface){
        this.commandManager = commandManager;
        this.client = commandManager.client;
        this.prefix = commandManager.prefix;
        
        this.name = options.name || '';
        this.description = options.description || '';
        this.aliases = options.aliases || [];
        this.usage = options.usage || '';
        this.enabled = (options.enabled == undefined || options.enabled == true) ? true : false;
        this.showInHelp = (options.showInHelp == undefined || options.showInHelp == true) ? true : false;
        this.permissions = options.permissions || [];
    }
    
    sendUsage(message: Message, deleteMsg: boolean = false){
        message.channel.send({embeds: [{ color: 'BLUE' , description: '**Usage:** '+ this.commandManager.prefix + this.name + ' '+ this.usage}]}).then(m => {
            if(deleteMsg) {
                setTimeout(() => {
                    message.delete()
                    m.delete()
                }, 4000)
            }
        })
    }

    abstract execute(message: Message, commandArgs: Array<string>): void;
}
export default Command;
