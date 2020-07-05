const Discord = require('discord.js');
const fs = require('fs');

class CommandLoader{
    constructor(client){
        this.client = client;
        this.prefix = 'y!';
        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();
        
        this.loadAllCommands();
    }
    
    execute(message){
        var commandName = message.content.split(' ')[0].split(this.prefix)[1]
        var command = this.getCommandByName(commandName)
        
        if(command == null){
            message.channel.send({
                embed: {
                    color: '#FF0000',
                    description: "Command not found! Use **"+ this.prefix +"help** to get command list."
                }
            });
        } else {
            var commandArgs = message.content.split(' ')
            commandArgs.shift()
            command.execute(message, commandArgs)
        }
    }
    
    loadAllCommands(){
        fs.readdirSync(`${__dirname}/../commands`).filter(f => !(f.endsWith('.js'))).forEach(dir => {
            const commands = fs.readdirSync(`${__dirname}/../commands/${dir}`).filter(f => f.endsWith('.js'));
            
            commands.forEach(f => {
                const command = require(`${__dirname}/../commands/${dir}/${f}`)
                const commandClass = new command(this)
                
                if(commandClass.enable){
                    this.loadCommand(commandClass)
                }
            })
        })
        this.getCommandByName('help').loadHelpContents()
        this.client.logger.info("Commands Loaded.")
    }
    
    getCommandByName(name){
        var command = this.commands.get(name) || this.aliases.get(name)
        return command;
    }
    
    loadCommand(commandClass){
        this.commands.set(commandClass.name, commandClass)
        if(commandClass.aliases){
            commandClass.aliases.forEach(alias => {
                this.aliases.set(alias, commandClass)
            })
        }
    }
}

module.exports = CommandLoader