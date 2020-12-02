const Command = require('../../../utils/Command.js')
const Profile = require('./models/profile.js')

class LinkProfile extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'link-profile',
            description: 'Link your MAL/AniList profile.',
            usage: '<mal|al> <username>',
            aliases: ['lp']
        })
    }

    execute(message, commandArgs){
        const type = commandArgs[0];
        if(type){
            if(type == 'mal' || type == 'al'){
                if(type == 'mal'){
                    message.channel.reply('MAL is still WIP.')
                    return
                }
                if(commandArgs[1]){
                    const username = commandArgs[1].toLowerCase();

                    if(this.client.profiles.get(message.author.id)){
                        message.channel.reply('Your profile is already linked.')
                        return
                    }
                }
            } else {
                this.sendUsage(message)
            }
        }
    }
}

module.exports = LinkProfile;
