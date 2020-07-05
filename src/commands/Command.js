class Commmand {
    constructor(commandLoader, options){
        this.commandLoader = commandLoader;
        this.client = commandLoader.client;
        this.prefix = commandLoader.prefix;
        
        this.name = options.name;
        this.commandName = this.prefix + this.name;
        this.description = options.description || '';
        this.usage = (options.usage == null) ? this.commandName : this.commandName +" "+ options.usage;
        this.aliases = options.aliases || [];
        
        this.enable = options.enable || true;
    }
}
module.exports = Commmand;