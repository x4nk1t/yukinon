const Command = require('../../../utils/Command.js')

class Volume extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'user',
            description: 'Check smmo user.',
            usage: '<id>'
        })
    }

    async execute(message, commandArgs){
        message.channel.send('Work in progress.')
        return
        if(commandArgs[0]){
            var id = commandArgs[0];
            if(!isNaN(id) && !isNaN(parseFloat(id))){
                //SMMO API
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = Volume