const Command = require('../../../utils/Command.js');
const SMMO = require('../models/smmo.js');

class SendDaily extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'send-daily',
            description: 'Toggle sending smmo daily stats to your dm.',
            aliases: ['sd']
        })
    }

    async execute(message, commandArgs){
        const manager = this.client.smmoManager;
        const user_id = message.author.id;
        const profile = manager.profiles.get(user_id)
        
        if(profile == null){
            message.channel.send({embed: {color: 'BLUE', description: 'You must link your profile first!'}})
            return
        }

        var will_wont = '';

        if(profile.send_daily == 0){
            profile.send_daily = 1;
            will_wont = 'will'
        } else {
            profile.send_daily = 0;
            will_wont = 'won\'t'
        }

        await this.updateDaily(profile)
        message.channel.send({embed: {color: 'BLUE', description: message.author.toString() +', You **'+ will_wont +'** be receiving daily stats in your DM!'}})
    }

    updateDaily(profile){
        return new Promise((resolve, reject) => {
            SMMO.collection.updateOne({_id: profile._id}, {$set: {send_daily: profile.send_daily}}, err => {
                if(err){
                    this.client.logger.error(err)
                    reject(err)
                    return
                }
                resolve()
            })
        })

    }
}

module.exports = SendDaily