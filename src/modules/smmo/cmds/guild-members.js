const Discord = require('discord.js');
const Functions = require('../../../Functions.js');
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
        const attackMode = commandArgs[1] ? commandArgs[1].toLowerCase() == "atk" : false;

        if(!id){
            this.sendUsage(message)
            return
        }

        if(!isNaN(id) && !isNaN(parseFloat(id))){
            var membersData;
            var guildData;
            var usersData = [];
            var notFound = false;
            
            await manager.sendRequest('post', '/guilds/info/'+ id).then(guildResponse => {
                guildData = guildResponse.data;

                if(guildData.error && guildData.error == 'guild not found'){
                    notFound = true;
                    message.channel.send({embed: {color: 'BLUE', description: 'Guild not found!'}})
                    return
                }
            })
            
            if(notFound) return

            await manager.sendRequest('post', '/guilds/members/'+ id).then(membersResponse => {
                membersData = membersResponse.data;
            })
            
            var firstPage = await message.channel.send({embed: {color: 'BLUE', description: 'This might take some time. Please wait.'}})

            for(const info of membersData){
                var user_id = info.user_id;

                await manager.sendRequest('post', '/player/info/'+ user_id).then(response2 => {
                    if(response2.error) return

                    usersData.push(response2.data)
                })
            }

            var title = '(Count '+ usersData.length +')'

            if(attackMode) {
                usersData = usersData.filter(user => !user.safeMode)
                title = '('+ usersData.length +' Attackable)'
            }

            const lastPage = usersData.length / 10;
            const lastPageFloor = Math.floor(lastPage);

            const embed = {
                color: 'BLUE',
                title: guildData.name + ' Members '+ title,
                thumbnail: {url: 'https://web.simple-mmo.com/img/icons/'+ guildData.icon },
                url: 'https://web.simple-mmo.com/guilds/view/'+ guildData.id +'/members',
                description: this.getPage(0, usersData, attackMode),
                footer: {
                    text: 'Requested by '+ message.author.username + ' • Page (1/'+ (lastPageFloor + 1) +')',
                    icon_url: message.author.displayAvatarURL()
                },
            }

            await firstPage.edit({embed: embed})

            if(lastPage <= 1) return

            Functions.createReactionCollector(message, firstPage, lastPageFloor, async (page) => {
                embed.description = this.getPage(page, usersData, attackMode)
                embed.footer.text = 'Requested by '+ message.author.username + ' • Page ('+ (page + 1) +'/'+ (lastPageFloor + 1) +')'

                await firstPage.edit({embed: embed})
            })
        } else {
            this.sendUsage(message)
        }
    }

    getPage(page, usersData, attackMode){
        const perPage = 10;
        const startIndex = page * perPage;
        var description = '';

        for(var i = startIndex; i < (startIndex + perPage); i++){
            const user = usersData[i];
            if(!user) continue;

            const pleb = user.membership == 1 ? Constants.PLEB : '';
            
            if(attackMode) {
                var attackable = "";
                if ((user.hp / user.max_hp * 100) < 50){
                    attackable = "❌ `HP: "+ (user.hp / user.max_hp * 100).toFixed(2) + "%`";
                } else {
                    attackable = "✅";
                }
                description += `[ID: ${user.id}] [${user.name}](https://web.simple-mmo.com/user/attack/${user.id}) ${pleb} (Lv. ${user.level.toLocaleString()}) - **Attackable:** ${attackable}\n`;
            } else {
                const safeMode = user.safeMode == 1 ? Constants.SAFE_FLAG : '';
                description += `[ID: ${user.id}] [${user.name}](https://web.simple-mmo.com/user/view/${user.id}) ${pleb} ${safeMode} (Lv. ${user.level.toLocaleString()})\n`;
            }
        }

        return description
    }
}

module.exports = GuildMembers