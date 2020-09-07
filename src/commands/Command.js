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
        this.permissions = options.permissions || [];
        this.guildCommand = options.guildCommand || false; 
        
        this.enable = options.enable || true;
    }

    hasRequiredPermissions(message){
        if(this.permissions.length){
            var countPermission = 0;
            this.permissions.forEach(permission => {
                if(message.member.hasPermission(permission)){
                    countPermission++;
                }
            });
            if(this.permissions.length != countPermission){
                message.channel.send({embed: {color: '#FF0000', description: 'You don\'t have required permissions to use this command.'}})

                return false
            } else {
                return true
            }
        }
        return true
    }
    
    sendUsage(message){
        message.channel.send({embed: {description: '**Usage:** '+ this.usage, color: '#FF0000'}})
    }
}
module.exports = Command;