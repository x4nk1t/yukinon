class Commmand {
    constructor(commandName, commandClass){
        this.commandName = commandName;
        this.commandClass = commandClass;
    }
    
    getCommandName(){
        return this.commandName;
    }
    
    getCommandClass(){
        return this.commandClass;
    }
}
module.exports = Commmand;