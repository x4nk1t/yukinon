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
        
        this.options = {
            name: options.name || '',
            description: options.description || '',
            aliases: options.aliases || [],
            guildOnly: options.guildOnly || true,
            usage: options.usage || '',
            enabled: options.enabled || true,
            permissionMessage: 'You don\'t have permission to use this command.',
            requirements: {
                permissions: options.permissions || {},
            },
            invalidUsageMessage: message => { return 'Usage: '+ message.prefix + options.name +' '+ options.usage}
        }
    }
    
    sendUsage(message, deleteMsg = false){
        message.channel.createMessage('**Usage:** '+ message.prefix + this.options.name + ' '+ this.options.usage).then(m => {
            if(deleteMsg) {
                setTimeout(() => {
                    message.delete()
                    m.delete()
                }, 4000)
            }
        })
    }
}
module.exports = Command;
