const Command = require('../../../utils/Command.js');
const Constants = require('../Constants.js');

class Guild extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'guild',
            description: 'Check a smmo guild.',
            usage: '<id>',
            aliases: ['g']
        })
    }

    execute(message, commandArgs){
        const manager = this.client.smmoManager;
        const id = commandArgs[0];

        if(!id){
            this.sendUsage(message)
            return
        }

        if(!isNaN(id) && !isNaN(parseFloat(id))){
            manager.sendRequest('post', '/guilds/info/'+ id)
                .then(async response => {
                    const data = response.data;
                    
                    if(data.error == 'guild not found'){
                        message.channel.send({embed: {color: 'BLUE', description: 'Guild not found!'}})
                        return
                    }
                    var leaderData;
                    var membersCount;

                    await manager.sendRequest('post', '/player/info/'+ data.owner).then(response2 => {
                        leaderData = response2.data;
                    })

                    await manager.sendRequest('post', '/guilds/members/'+ id).then(membersResponse => {
                        membersCount = membersResponse.data.length;
                    })

                    const embed = {
                        title: data.name,
                        url: 'https://web.simple-mmo.com/guilds/view/'+ data.id,
                        thumbnail: {url: Constants.ICONS_URL + data.icon},
                        color: 'BLUE',
                        fields: [
                            { name: 'Leader', value: `[${leaderData.name}](https://web.simple-mmo.com/user/view/${leaderData.id})` },
                            { name: 'Tag', value: `\`${data.tag}\``, inline: true },
                            { name: 'EXP', value: data.exp.toLocaleString(), inline: true },
                            { name: 'PvP', value: data.passive == 0 ? 'Yes' : 'No', inline: true },
                            { name: 'Total Members', value: membersCount, inline: true }
                        ]
                    }

                    message.channel.send({embed: embed})
                })
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = Guild