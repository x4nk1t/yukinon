const fs = require('fs');

class CommandLoader{
    constructor(bot){
        this.prefix = 'y!';
        this.bot = bot;
        this.loadedCommands = [];
        this.client = bot.client;
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
                this.bot.logger.info("Commands Loaded.")
            }
        })
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
        this.loadedCommands.push({commandName: commandClass.name, commandClass: commandClass})
    }
}

module.exports = CommandLoader