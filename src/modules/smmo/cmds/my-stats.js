const Command = require('../../../utils/Command.js');

class MyStats extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'my-stats',
            description: 'Check your daily smmo stats.',
            aliases: ['ms']
        })
    }

    execute(message, commandArgs){
        const manager = this.client.smmoManager;
        const d = manager.profiles.get(message.author.id)

        if(d == null){
            message.channel.send({embed: {color: 'BLUE', description: 'You must linked your account first!'}})
            return
        }
        
        const id = d.ingame_id;

        if(!isNaN(id) && !isNaN(parseFloat(id))){
            manager.sendRequest('post', '/player/info/'+ id)
                .then(async response => {
                    const data = response.data;
                    
                    if(data.error == 'user not found'){
                        message.channel.send({embed: {color: 'BLUE', description: 'User not found.'}})
                        return
                    }
                    
                    const stats = manager.profile_stats.get(id);

                    if(stats == null || stats.level == 0){
                        message.channel.send({embed: {color: 'BLUE', description: 'It takes a day to generate your stats if you just linked your account!'}})
                        return
                    }

                    const {name, level, steps, npc_kills, user_kills, quests_complete} = data;

                    const embed = {
                        color: 'BLUE',
                        url: 'https://web.simple-mmo.com/user/view/'+ id,
                        title: name +'\'s stats',
                        fields: [
                            {name: 'Level', value: level - stats.level, inline: true},
                            {name: 'Steps', value: steps - stats.steps, inline: true},
                            {name: 'NPC Kills', value: npc_kills - stats.npc_kills, inline: true},
                            {name: 'User Kills', value: user_kills - stats.user_kills, inline: true},
                            {name: 'Quests Complete', value: quests_complete - stats.quests_complete, inline: true}
                        ]
                    }

                    message.channel.send({embed: embed})
                })
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = MyStats