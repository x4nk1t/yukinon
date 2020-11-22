const Discord = require('discord.js')
const fs = require('fs');
const Command = require('./Command.js');
const chokidar = require('chokidar')

class CommandLoader{
    constructor(client){
        this.client = client;
        this.prefix = client.devMode ? '!!' : '!';
        
        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();
        
        this.loadAllCommands();
    }
    
    loadAllCommands(){
        fs.readdirSync(`${__dirname}/../commands`).filter(f => !(f.endsWith('.js'))).forEach(dir => {
            const commands = fs.readdirSync(`${__dirname}/${dir}`).filter(f => f.endsWith('.js'));
            
            commands.forEach(f => {
                const command = require(`${__dirname}/${dir}/${f}`)
                const commandClass = new command(this)
                
                if(commandClass instanceof Command){
                    if(commandClass.options.enabled) {
                        this.loadCommand(commandClass)
                    } else {
                        this.client.logger.error(`Couldn't load ${f}. Reason: Not enabled.`)
                    }
                } else {
                    this.client.logger.error(`Couldn't load ${f}. Reason: Not a command.`)
                }
            })
        })
        
        if(this.client.devMode) this.runHotReload()
    }
    
    runHotReload(){
        chokidar.watch('.').on('change', (path, event) => {
            const fileName = path.split('/')[path.split('/').length - 1];
            const folderName = path.split('/')[path.split('/').length - 2];
            const folderPath = folderName +'/'+ fileName;
            
            if(fileName.endsWith('.js')){
                if(updatedCommand instanceof Command) {
                    this.client.logger.info(`Updating ${folderPath}`)
                    delete require.cache[require.resolve('./'+ folderPath)]
                    const command = require('./'+ folderPath)
                    
                    const updatedCommand = new command(this)
                    
                    this.unloadCommand(updatedCommand)
                
                    if(updatedCommand.options.enabled) {
                        this.loadCommand(updatedCommand)
                    } else {
                        this.client.logger.error(updatedCommand.options.name +' command has been disabled in new update.')
                    }
                } else {
                    this.client.logger.error('Updated command is not instance of Command.')
                }
            }
        })
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
        commandClass.options.aliases.forEach(alias => {
            this.aliases.set(alias, commandClass)
        })
        this.commands.set(name, commandClass)
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

module.exports = CommandLoader
