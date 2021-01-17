const Discord = require('discord.js');
const Command = require('../../../utils/Command.js');

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
            var guildData;
            var usersData = new Discord.Collection();
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

            const lastPage = Math.floor(membersData.length / 10);
            
            var sent = await message.channel.send({embed: {color: 'BLUE', description: 'This might take some time. Please wait.'}})

            for(const info of membersData){
                var user_id = info.user_id;

                await manager.sendRequest('post', '/player/info/'+ user_id).then(response2 => {
                    if(response2.error) return

                    usersData.set(user_id, response2.data)
                })
            }

            const embed = {
                color: 'BLUE',
                title: guildData.name + ' Members (Count '+ membersData.length +')',
                description: this.getPage(0, usersData),
                footer: {
                    text: 'Requested by '+ message.author.username + ' • Page (1/'+ (lastPage + 1) +')',
                    icon_url: message.author.displayAvatarURL()
                },
            }

            if(sent) sent.delete()
            const firstPage = await message.channel.send({embed: embed})

            if(lastPage == 0) return
            const emojis = ['⏪', '◀️', '▶️' ,'⏩']

            var page = 0;

            emojis.forEach(emoji => { firstPage.react(emoji) })

            const reactionCollector = firstPage.createReactionCollector((reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot, { time: 120000 })
            reactionCollector.on('collect', reaction => {
                reaction.users.remove(message.author)

                switch(reaction.emoji.name){
                    case emojis[0]:
                        page = 0;
                    break;
                    case emojis[1]:
                        page = (page == 0) ? 0 : page - 1;
                    break;

                    case emojis[2]:
                        page = (page == lastPage) ? lastPage : page + 1;
                    break;

                    case emojis[3]:
                        page = lastPage;
                    break;
                }

                const embed2 = {
                    color: 'BLUE',
                    title: guildData.name + ' Members (Count '+ membersData.length +')',
                    description: this.getPage(page, usersData),
                    footer: {
                        text: 'Requested by '+ message.author.username + ' • Page ('+ (page + 1) +'/'+ (lastPage + 1) +')',
                        icon_url: message.author.displayAvatarURL()
                    },
                }

                firstPage.edit({embed: embed2})
            })
        } else {
            this.sendUsage(message)
        }
    }

    getPage(page, users){
        const usersData = users.array()
        const perPage = 10;
        const startIndex = page * perPage;
        var description = '';

        for(var i = startIndex; i < (startIndex + perPage); i++){
            const user = usersData[i];
            if(!user) continue;
            description += `[${user.name}](https://web.simple-mmo.com/user/view/${user.id}) (Lv. ${user.level.toLocaleString()})\n`;
        }

        return description
    }
}

module.exports = GuildMembers