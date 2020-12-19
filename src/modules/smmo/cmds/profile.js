const Command = require('../../../utils/Command.js')

class Profile extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'profile',
            description: 'Check your smmo linked profile.',
            aliases: ['me']
        })
    }

    execute(message, commandArgs){
        const manager = this.client.smmoManager;
        const d = manager.profiles.get(message.author.id)

        if(d == null){
            message.channel.send({embed: {color: 'BLUE', description: 'You must link your account first!'}})
            return
        }

        const id = d.ingame_id;

        manager.sendRequest('post', 'https://api.simple-mmo.com/v1/player/info/'+ id)
            .then(response => {
                const data = response.data;
                
                if(data.error == 'user not found'){
                    message.channel.send({embed: {color: 'BLUE', description: 'User not found.'}})
                    return
                }

                const embed =  manager.profileEmbed(message, data)

                message.channel.send({embed: embed})
            }).catch(err => {
                console.error(err)
                message.channel.send({color: 'BLUE', description: 'Something went wrong. Try again later.'})
            })
    }
}

module.exports = Profile