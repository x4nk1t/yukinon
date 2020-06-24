const HelpCommand = require('./HelpCommand.js');
const PingCommand = require('./PingCommand.js');
const UptimeCommand = require('./UptimeCommand.js');
const Command = require('./Command.js');

class CommandLoader{
    constructor(client){
        this.prefix = 'cc!';
        this.loadedCommands = [];
        this.startTime = new Date().getTime()
        this.client = client
        this.colorArray = ['#FF6633','#FFB399','#FF33FF','#FFFF99','#00B3E6','#E6B333','#3366E6','#999966','#99FF99','#B34D4D','#80B300','#809900','#E6B3B3','#6680B3','#66991A','#FF99E6','#CCFF1A','#FF1A66','#E6331A','#33FFCC','#66994D','#B366CC','#4D8000','#B33300','#CC80CC','#66664D','#991AFF', '#E666FF','#4DB3FF','#1AB399','#E666B3','#33991A','#CC9999','#B3B31A','#00E680','#4D8066','#809980','#E6FF80','#1AFF33','#999933','#FF3380', '#CCCC00','#66E64D','#4D80CC','#9900B3','#E64D66','#4DB380','#FF4D4D','#99E6E6','#6666FF'];
        
        this.loadAllCommands();
    }
    
    onCommand(message){
        var commandName = message.content.split(' ')[0].split(this.prefix)[1]
        var command = this.getCommandByName(commandName)
        
        if(command == null){
            message.channel.send("Command not found! Use "+ this.prefix +"help to get command list.");
        } else {
            var commandArgs = message.content.split(' ').shift()
            command.onCommand(message, commandArgs)
        }
    }
    
    loadAllCommands(){
        this.loadCommand('help', new HelpCommand(this))
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