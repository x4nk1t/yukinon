class Commmand {
    constructor(commandLoader, name, description = "", usage = "", aliases = []){
        this.commandLoader = commandLoader;
        this.prefix = commandLoader.prefix;
        this.name = name;
        this.commandName = this.prefix + name;
        this.description = description;
        this.usage = (usage == "") ? this.commandName : this.commandName +" "+ usage;
        this.aliases = aliases;
        
        this.enable = true;
        this.client = commandLoader.client;
    }
}
module.exports = Commmand;