const Command = require('../../../utils/Command.js')

class FindGold extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'find-gold',
            description: 'Search for player with gold in a specific guild.',
            aliases: ['fg'],
            showInHelp: false
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
            var unfilteredUsersData = [];
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

                    unfilteredUsersData.push(response2.data)
                })
            }

            const usersData = unfilteredUsersData.filter((user) => (user.gold >= 500000 && !user.safeMode))

            usersData.sort((a, b) => b.gold - a.gold)

            const lastPage = Math.floor(usersData.length / 10);

            const embed = {
                color: 'BLUE',
                title: guildData.name + ' Members w/ GOLDS',
                url: 'https://web.simple-mmo.com/guilds/view/'+ guildData.id +'/members',
                description: this.getPage(0, usersData),
                footer: {
                    text: 'Requested by '+ message.author.username + ' • Page (1/'+ (lastPage + 1) +')',
                    icon_url: message.author.displayAvatarURL()
                },
            }

            if(embed.description == "") embed.description = 'No members found with 500k+ gold and off safemode.'

            await firstPage.edit({embed: embed})

            if(lastPage == 0) return
            const emojis = ['⏪', '◀️', '▶️' ,'⏩']

            var page = 0;

            emojis.forEach(emoji => { firstPage.react(emoji) })

            const reactionCollector = firstPage.createReactionCollector((reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot, { time: 300000 })
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

                embed.description = this.getPage(page, usersData)
                embed.footer = {
                    text: 'Requested by '+ message.author.username + ' • Page ('+ (page + 1) +'/'+ (lastPage + 1) +')',
                    icon_url: message.author.displayAvatarURL()
                }

                firstPage.edit({embed: embed})
            })
        } else {
            this.sendUsage(message)
        }
    }

    getPage(page, usersData){
        const perPage = 10;
        const startIndex = page * perPage;
        var description = '';

        for(var i = startIndex; i < (startIndex + perPage); i++){
            const user = usersData[i];
            
            if(!user) continue;

            var attackable = '';

            if ((user.hp / user.max_hp * 100) < 50){
                attackable = "❌ `HP: "+ (user.hp / user.max_hp * 100).toFixed(2) + "%`";
            } else {
                attackable = "✅";
            }

            description += `[ID: ${user.id}] [${user.name}](https://web.simple-mmo.com/user/attack/${user.id}) - Lv. ${user.level.toLocaleString()} (Gold: ${user.gold.toLocaleString()}) - **Attackable:**${attackable}\n`;
        }

        return description
    }
}

module.exports = FindGold