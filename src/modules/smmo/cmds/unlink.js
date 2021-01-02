const Command = require('../../../utils/Command.js');
const SMMO = require('../models/smmo.js');

class Unlink extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'unlink',
            description: 'Unlink SMMO profile.',
        })
    }

    execute(message, commandArgs){
        const manager = this.client.smmoManager;
        const d = manager.profiles.get(message.author.id)

        if(d == null){
            message.channel.send({embed: {color: 'BLUE', description: 'You haven\'t linked your account yet!'}})
            return
        }
        
        SMMO.collection.removeOne({user_id: message.author.id}, err => {
            if(err){
                message.channel.send({embed: {color: 'BLUE', description: 'Something went wrong.'}})
                return
            }
            manager.profiles.delete(message.author.id)
            message.channel.send({embed: {color: 'BLUE', description: 'Successfully unlinked your account.'}})
        })
    }
}

module.exports = Unlink