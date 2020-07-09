const Discord = require('discord.js');
const fs = require('fs');
const Command = require('./Command.js');

class CommandLoader{
    constructor(client){
        this.client = client;
        this.prefix = 'y!';
        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();
        
        this.loadAllCommands();
    }
    
    execute(message){
        var commandName = message.content.split(' ')[0].split(this.prefix)[1]
        var command = this.getCommandByName(commandName)
        
        if(command == null){
            var embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setDescription("Command not found! Use **"+ this.prefix +"help** to get command list.")
            message.channel.send(embed);
        } else {
            var commandArgs = message.content.split(' ')
            commandArgs.shift()
            command.execute(message, commandArgs)
        }
    }
    
    loadAllCommands(){
        fs.readdirSync(`${__dirname}/../commands`).filter(f => !(f.endsWith('.js'))).forEach(dir => {
            const commands = fs.readdirSync(`${__dirname}/../commands/${dir}`).filter(f => f.endsWith('.js'));
            
            commands.forEach(f => {
                const command = require(`${__dirname}/../commands/${dir}/${f}`)
                const commandClass = new command(this)
                
                if(commandClass instanceof Command && commandClass.enable){
                    this.loadCommand(commandClass)
                } else {
                    this.client.logger.error(`Couldn't load ${f}. Either it is not enabled or is not command.`)
                }
            })
        })
        this.getCommandByName('help').loadHelpContents()
        this.client.logger.info("Commands Loaded.")
    }
    
    getCommandByName(name){
        var command = this.commands.get(name) || this.aliases.get(name)
        return command;
    }
    
    loadCommand(commandClass){
        this.commands.set(commandClass.name, commandClass)
        if(commandClass.aliases){
            commandClass.aliases.forEach(alias => {
                this.aliases.set(alias, commandClass)
            })
        }
    }
}

module.exports = CommandLoader