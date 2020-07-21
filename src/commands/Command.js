class Command {
    constructor(commandLoader, options){
        if(this.constructor === Command){
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        if(this.execute === undefined){
            throw new TypeError(`Method 'execute()' must be implemented.`)
        }
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
    
    sendUsage(message){
        message.channel.send({embed: {description: '**Usage:** '+ this.usage, color: '#FF0000'}})
        message.channel.stopTyping()
    }
}
module.exports = Command;