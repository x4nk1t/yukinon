const Command = require('../../../utils/Command.js');

class ReloadBoss extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'reload-boss',
            description: 'Reload world bosses.',
            aliases: ['rb'],
            showInHelp: false
        })
    }

    async execute(message, commandArgs){
        const manager = this.client.smmoManager;

        if(this.client.authorizedUsers.includes(message.author.id)){
            if(manager.worldboss.length){
                message.channel.send({embed: {color: 'BLUE', description: 'There are still bosses left. No need to reload.'}})
            } else {
                await manager.loadAllBosses()
                if(manager.worldboss.length){
                    message.channel.send({embed: {color: 'BLUE', description: 'Bosses reloaded. Use `!wb` to check!'}})
                } else {
                    message.channel.send({embed: {color: 'BLUE', description: 'There are no bosses this week. New bosses are available at Monday UTC 2PM'}})
                }
            }
        } else {
            message.channel.send({embed: {color: 'BLUE', description: 'You are not authorized to use this command.'}})
        }
    }
}

module.exports = ReloadBoss