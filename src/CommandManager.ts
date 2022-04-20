import { Collection, Message } from 'discord.js';

import Client from './Client';

import Command from './utils/Command';
import StatsCommand from './utils/cmds/stats';
import EmojisCommand from './utils/cmds/emojis';
import EvalCommand from './utils/cmds/eval';
import HelpCommand from './utils/cmds/help';
import ChangeStatus from './utils/cmds/change-status';

import botSettings from './utils/models/bot-settings';

class CommandManager{
    client: Client;
    prefix: string;
    commands: Collection<string, Command>;
    aliases: Collection<string, Command>;

    constructor(client: Client){
        this.client = client;
        this.prefix = client.devMode ? '!!' : '!';
        
        this.commands = new Collection();
        this.aliases = new Collection();

        this.loadCommands()
    }

    run(){
        botSettings.collection.findOne({name: 'status'}, async (err, status) => {
            if(err) return;
            
            if(status) this.client.user?.setStatus(status.value);
        })
    }
    
    loadCommands(){
        this.loadCommand(new StatsCommand(this));
        this.loadCommand(new EvalCommand(this));
        this.loadCommand(new ChangeStatus(this));
        this.loadCommand(new EmojisCommand(this));
        this.loadCommand(new HelpCommand(this));
    }
    
    execute(message: Message){
        var commandName = message.content.split(' ')[0].split(this.prefix)[1];
        var command = this.getCommand(commandName);

        if(command != null){
            if(!message.guild){
                message.channel.send({embeds: [{color: 'BLUE', description: 'You must be in guild to use commands.'}]});
                return;
            }

            const permissions = command.options.permissions || [];

            if(!message.member?.permissionsIn(message.channel.id).has(permissions)){
                message.channel.send({embeds: [{color: 'BLUE', description: `You don't have required permissions to use this command.`}]});
                return;
            }

            var commandArgs = message.content.split(' ');
            commandArgs.shift();
            command.execute(message, commandArgs);
        }
    }
    
    getCommand(name: string): Command | null{
        const command = this.commands.get(name) || this.aliases.get(name);
        
        if(!command) return null;
        
        return command;
    }
    
    registerCommand(name: string, commandClass: Command){
        if(this.commands.get(name)){
            this.client.logger.error(`Couldn't load ${name}. Reason: Already loaded.`);
            return;
        }
        commandClass.options.aliases.forEach(alias => {
            this.aliases.set(alias, commandClass);
        })
        this.commands.set(name, commandClass);
            
    }
    
    unloadCommand(commandClass: Command){
        commandClass.options.aliases.forEach(alias => {
            this.aliases.delete(alias);
        })
        this.commands.delete(commandClass.options.name);
    }
    
    loadCommand(commandClass: Command){
        this.registerCommand(commandClass.options.name, commandClass);
    }
}

export default CommandManager
