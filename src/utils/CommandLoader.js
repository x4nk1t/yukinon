const Discord = require('discord.js');
const fs = require('fs');

class CommandLoader{
    constructor(client){
        this.prefix = 'y!';
        this.client = client;
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
        var dir = fs.readdirSync(`${__dirname}/../commands`);
        dir.filter((file) => !(file.split('.')[0] == "Command")).map((d, i) => {
            const command = require(`${__dirname}/../commands/${d}`)
            const commandClass = new command(this)
            
            if(commandClass.enable){
                this.loadCommand(commandClass)
            }
            if(dir.length - 1 == i + 1){ //-1 Cause command is not counted & +1 to match the count
                this.getCommandByName('help').loadHelpContents()
                this.client.logger.info("Commands Loaded.")
            }
        })
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