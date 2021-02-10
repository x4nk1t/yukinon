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
        
        this.options = {
            name: options.name || '',
            description: options.description || '',
            aliases: options.aliases || [],
            guildOnly: (options.guildOnly == true ? true : false),
            usage: options.usage || '',
            enabled: (options.enabled == undefined || options.enabled == true) ? true : false,
            showInHelp: (options.showInHelp == undefined || options.showInHelp == true) ? true : false
        }
    }
    
    sendUsage(message, deleteMsg = false){
        message.channel.send({embed: { color: 'BLUE' , description: '**Usage:** '+ this.commandLoader.prefix + this.options.name + ' '+ this.options.usage}}).then(m => {
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
