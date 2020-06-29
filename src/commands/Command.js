class Commmand {
    constructor(commandPrefix, description = "", usage = "", aliases = []){
        this.commandPrefix = commandPrefix;
        this.description = description;
        this.usage = usage;
        this.aliases = aliases;
    }
}
module.exports = Commmand;