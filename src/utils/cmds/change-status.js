const Command = require('../Command.js');
const botSettings = require('../models/bot-settings.js');

class ChangeStatus extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "change-status",
            description: "Change status of bot.",
            aliases: ['cs'],
            guildOnly: true,
            showInHelp: false
        });

        this.statuses = ['online', 'dnd', 'idle', 'invisible']
    }

    async execute(message, commandArgs){
        if(this.client.authorizedUsers.includes(message.author.id) && commandArgs[0]){
            const status = commandArgs[0].toLowerCase()
            
            if(!this.statuses.includes(status)) return

            await this.client.user.setStatus(status)
            
            botSettings.collection.findOneAndUpdate({name: 'status'}, {$set: {value: status}}, err => {
                if(err) console.log(err)
            })

            await message.react('✅')
            setTimeout(() => { message.delete() }, 1000)
        }
    }
}

module.exports = ChangeStatus