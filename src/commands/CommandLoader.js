const fs = require('fs');
const Command = require('./Command.js');

class CommandLoader{
    constructor(client){
        this.client = client;
        
        this.loadAllCommands();
    }
    
    loadAllCommands(){
        fs.readdirSync(`${__dirname}/../commands`).filter(f => !(f.endsWith('.js'))).forEach(dir => {
            const commands = fs.readdirSync(`${__dirname}/../commands/${dir}`).filter(f => f.endsWith('.js'));
            
            commands.forEach(f => {
                const command = require(`${__dirname}/../commands/${dir}/${f}`)
                const commandClass = new command(this)
                
                if(commandClass instanceof Command && commandClass.options.enabled){
                    this.loadCommand(commandClass)
                } else {
                    this.client.logger.error(`Couldn't load ${f}. Either it is disabled or it is not a command.`)
                }
            })
        })
    }
    
    loadCommand(commandClass){
        this.client.registerCommand(commandClass.options.name, (message, args) => commandClass.execute(message, args), commandClass.options)
    }
}

module.exports = CommandLoader
