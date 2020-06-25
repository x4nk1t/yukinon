const discord = require('discord.js');
const HelpCommand = require('./HelpCommand.js');
const ImagesCommand = require('./ImagesCommand.js');
const PingCommand = require('./PingCommand.js');
const UptimeCommand = require('./UptimeCommand.js');
const Command = require('./Command.js');

class CommandLoader{
    constructor(server){
        this.prefix = 'y!';
        this.server = server;
        this.loadedCommands = [];
        this.startTime = new Date().getTime();
        this.client = server.client;
        this.loadAllCommands();
        
        server.logger.info("Commands Loaded.")
    }
    
    onCommand(message){
        var commandName = message.content.split(' ')[0].split(this.prefix)[1]
        var command = this.getCommandByName(commandName)
        
        if(command == null){
            const embed = new discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setDescription("Command not found! Use "+ this.prefix +"help to get command list.")
            message.channel.send(embed);
        } else {
            var commandArgs = message.content.split(' ')
            commandArgs.shift()
            command.onCommand(message, commandArgs)
        }
    }
    
    loadAllCommands(){
        this.loadCommand('help', new HelpCommand(this))
        this.loadCommand('images', new ImagesCommand(this))
        this.loadCommand('ping', new PingCommand(this))
        this.loadCommand('uptime', new UptimeCommand(this))
    }
    
    getCommandByName(commandName){
        for(var i = 0; i < this.loadedCommands.length; i++){
            if(this.loadedCommands[i].getCommandName() == commandName){
                return this.loadedCommands[i].getCommandClass();
            }
        }
        return null;
    }
    
    loadCommand(commandName, className){
        this.loadedCommands.push(new Command(commandName, className))
    }
}

module.exports = CommandLoader