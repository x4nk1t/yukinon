const Command = require('../../../utils/Command.js');
const Constants = require('../Constants.js');

class GuildMembers extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'guild-members',
            description: 'Check a smmo guild members.',
            usage: '<id>',
            aliases: ['gm']
        })
    }

    async execute(message, commandArgs){
        const manager = this.client.smmoManager;
        const id = commandArgs[0];

        if(!id){
            this.sendUsage(message)
            return
        }

        if(!isNaN(id) && !isNaN(parseFloat(id))){
            var membersData;
            var description = '';
            var members = [];
            var guildData;

            if(manager.guildMembersCache.get(id)){
                const cache = manager.guildMembersCache.get(id);
                const diff = (new Date().getTime() - cache.last_updated);

                if(diff < 3600000){//1hr
                    membersData = cache.data;
                } else {
                    manager.guildMembersCache.delete(id)
                    this.execute(message, commandArgs)
                    return
                }
            } else {
                message.channel.send({embed: {color: 'BLUE', description: 'This might take some time. Please wait.'}})
                
                await manager.sendRequest('post', '/guilds/members/'+ id).then(membersResponse => {
                    membersData = membersResponse.data;
                    if(membersData.error && membersData.error == 'guild not found'){
                        message.channel.send({embed: {color: 'BLUE', description: 'Guild not found!'}})
                        return
                    }

                    manager.guildMembersCache.set(id, {data: membersData, last_updated: new Date().getTime()})
                })
            }

            await manager.sendRequest('post', '/guilds/info/'+ id).then(guildResponse => {
                guildData = guildResponse.data;
            })

            for(const info of membersData){
                var user_id = info.user_id;

                if(!manager.usersProfileCache.get(user_id)){
                    await manager.sendRequest('post', '/player/info/'+ user_id).then(response2 => {
                        if(response2.error) return

                        manager.usersProfileCache.set(user_id, {data: response2.data, last_updated: new Date().getTime()})
                    })
                }

                const userData = manager.usersProfileCache.get(user_id).data;
                members.push({id: userData.id, name: userData.name, level: userData.level})
            }

            for(var i = 0; i < 10; i++){
                const member = members[i];
                if(member) description += `${i + 1}. [${member.name}](https://web.simple-mmo.com/user/view/${member.id}/attack) - Level ${member.level} \n`
            }

            const embed = {
                title: guildData.name,
                color: 'BLUE',
                thumbnail: {url: Constants.ICONS_URL + guildData.icon},
                url: 'https://web.simple-mmo.com/guilds/view/'+ guildData.id,
                description: description,
                footer: {
                    text: 'Requested by '+ message.author.username,
                    icon_url: message.author.displayAvatarURL()
                }
            }

            message.channel.send({embed: embed})
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = GuildMembers