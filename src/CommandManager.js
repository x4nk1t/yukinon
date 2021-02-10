const Discord = require('discord.js')
const Command = require('./utils/Command.js');

const StatsCommand = require('./utils/cmds/stats.js')
const EmojisCommand = require('./utils/cmds/emojis.js')
const EvalCommand = require('./utils/cmds/eval.js')
const HelpCommand = require('./utils/cmds/help.js')
const ChangeStatus = require('./utils/cmds/change-status.js')
const RemindMeCommand = require('./modules/reminders/cmds/remind-me.js')

const BotSettings = require('./utils/models/bot-settings.js')

class CommandManager{
    constructor(client){
        this.client = client;
        this.prefix = client.devMode ? '!!' : '!';
        
        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();

        this.loadCommands()
    }

    run(){
        BotSettings.collection.findOne({name: 'status'}, async (err, status) => {
            if(err) return
            
            await this.client.user.setStatus(status.value);
        })
    }
    
    loadCommands(){
        this.loadCommand(new StatsCommand(this))
        this.loadCommand(new EvalCommand(this))
        this.loadCommand(new ChangeStatus(this))
        this.loadCommand(new EmojisCommand(this))
        this.loadCommand(new HelpCommand(this))
        this.loadCommand(new RemindMeCommand(this))
    }
    
    execute(message){
        var commandName = message.content.split(' ')[0].split(this.prefix)[1]
        var command = this.getCommand(commandName)

        if(command != null){
            if(command.options.guildOnly && !message.guild){
                message.channel.send('You must be in guild to use this command.')
                return;
            }

            var commandArgs = message.content.split(' ')
            commandArgs.shift()
            command.execute(message, commandArgs)
        }
    }
    
    getCommand(name){
        const command = this.commands.get(name) || this.aliases.get(name)
        
        if(!command) return null
        
        return command
    }
    
    registerCommand(name, commandClass){
        if(this.commands.get(name)){
            this.client.logger.error(`Couldn't load ${name}. Reason: Already loaded.`)
            return
        }
        if(commandClass instanceof Command){
            commandClass.options.aliases.forEach(alias => {
                this.aliases.set(alias, commandClass)
            })
            this.commands.set(name, commandClass)
        } else {
            this.client.logger.error(`${name} is not instance of Command class`)
        }
    }
    
    unloadCommand(commandClass){
        commandClass.options.aliases.forEach(alias => {
            this.aliases.delete(alias)
        })
        this.commands.delete(commandClass.options.name)
    }
    
    loadCommand(commandClass){
        this.registerCommand(commandClass.options.name, commandClass)
    }
}

module.exports = CommandManager
