const discord = require('discord.js');
const ARCCommand = require('./ARCCommand.js');
const CoinFlipCommand = require('./CoinFlipCommand.js');
const HelpCommand = require('./HelpCommand.js');
const ImagesCommand = require('./ImagesCommand.js');
const PingCommand = require('./PingCommand.js');
const StatsCommand = require('./StatsCommand.js');
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
                    .setDescription("Command not found! Use **"+ this.prefix +"help** to get command list.")
            message.channel.send(embed);
        } else {
            var commandArgs = message.content.split(' ')
            commandArgs.shift()
            command.onCommand(message, commandArgs)
        }
    }
    
    loadAllCommands(){
        this.loadCommand(new ARCCommand(this))
        this.loadCommand(new CoinFlipCommand(this))
        this.loadCommand(new HelpCommand(this))
        this.loadCommand(new ImagesCommand(this))
        this.loadCommand(new PingCommand(this))
        this.loadCommand(new StatsCommand(this))
        this.loadCommand(new UptimeCommand(this))
        
        this.getCommandByName('help').loadHelpContents()
    }
    
    getCommandByName(commandName){
        for(var i = 0; i < this.loadedCommands.length; i++){
            if(this.loadedCommands[i].commandName == commandName){
                return this.loadedCommands[i].commandClass;
            }
        }
        return null;
    }
    
    loadCommand(commandClass){
        this.loadedCommands.push({commandName: commandClass.commandName, commandClass: commandClass})
    }
}

module.exports = CommandLoader