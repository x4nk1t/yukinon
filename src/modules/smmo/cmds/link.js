const Command = require('../../../utils/Command.js');
const SMMO = require('../models/smmo.js');

class Link extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'link',
            description: 'Link SMMO profile.',
            usage: '<id>'
        })
    }

    execute(message, commandArgs){
        const manager = this.client.smmoManager;

        if(commandArgs[0]){
            const d = manager.profiles.get(message.author.id)
            if(d != null){
                message.channel.send({embed: {color: 'BLUE', description: 'You have already linked your account!'}})
                return
            }
            
            const id = commandArgs[0];

            if(!isNaN(id) && !isNaN(parseFloat(id))){
                manager.sendRequest('post', '/player/info/'+ id)
                    .then(async response => {
                        const data = response.data;
                        
                        if(data.error == 'user not found'){
                            message.channel.send({embed: {color: 'BLUE', description: 'User not found.'}})
                            return
                        }

                        SMMO.collection.insertOne({user_id: message.author.id, ingame_id: id}, err => {
                            if(err){
                                message.channel.send({embed: {color: 'BLUE', description: 'Something went wrong.'}})
                                return
                            }
                            manager.profiles.set(message.author.id, {user_id: message.author.id, ingame_id: id})
                            message.channel.send({embed: {color: 'BLUE', description: 'Successfully linked your account.'}})
                        })
                    })
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = Link