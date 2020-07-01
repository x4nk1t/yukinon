class Commmand {
    constructor(commandLoader, name, description = "", usage = "", aliases = []){
        this.commandLoader = commandLoader;
        this.name = name;
        this.commandName = commandLoader.prefix + name;
        this.description = description;
        this.usage = (usage == "") ? this.commandName : this.commandName +" "+ usage;
        this.aliases = aliases;
        
        this.enable = true;
        
        this.bot = commandLoader.bot;
        this.client = this.bot.client;
    }
}
module.exports = Commmand;