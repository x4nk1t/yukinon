const Command = require('../../../utils/Command.js')

class User extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'user',
            description: 'Check smmo user with id.',
            usage: '<id|tag>',
            aliases: ['u']
        })
    }

    async execute(message, commandArgs){
        const manager = this.client.smmoManager;

        if(commandArgs[0]){
            var id = commandArgs[0];
            const mention = message.mentions.users.first();
            if(mention){
                const profile = manager.profiles.get(mention.id)
                if(profile) {
                    id = profile.ingame_id;
                } else {
                    message.channel.send({embeds: [{color: 'BLUE', description: mention.toString() +' haven\'t linked their account yet!'}]})
                    return
                }
            }
            if(!isNaN(id) && !isNaN(parseFloat(id))){
                manager.sendRequest('post', '/player/info/'+ id)
                    .then(response => {
                        const data = response.data;
                        
                        if(data.error == 'user not found'){
                            message.channel.send({embeds: [{color: 'BLUE', description: 'User not found.'}]})
                            return
                        }

                        const embed =  manager.profileEmbed(message, data)

                        message.channel.send({embeds: [embed]})
                    }).catch(err => {
                        console.error(err)
                        message.channel.send({color: 'BLUE', description: 'Something went wrong. Try again later.'})
                    })
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = User