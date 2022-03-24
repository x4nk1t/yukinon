const Command = require('../../../utils/Command.js')

class War extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'war',
            description: 'Attackable players list.',
            usage: '[add|remove|list] [guild id]',
            aliases: ['w']
        })
    }

    async execute(message, commandArgs){
        const manager = this.client.smmoManager;

        var list = manager.war_list.get(message.author.id)
        var action = commandArgs[0];

            
        if(action == "add" || action == "remove"){
            var id = commandArgs[1];
            if(!isNaN(id) && !isNaN(parseFloat(id))){
                if(!list){
                    manager.war_list.set(message.author.id, {user_id: message.author.id, guilds_id: []})
                    list = manager.war_list.get(message.author.id)
                }

                if(action == "add"){
                    if(!list.guilds_id.includes(id)){
                        list.guilds_id.push(id)

                        manager.updateWar(list)
                        message.channel.send(this.embed(`Added guild id **${id}** to your target list.`))
                    } else {
                        message.channel.send(this.embed(`Guild id **${id}** is already on the target list.`))
                    }
                } else {
                    if(!list.guilds_id.includes(id)){
                        message.channel.send(this.embed(`Guild id **${id}** is not on your target list.`))
                    } else {
                        list.guilds_id.splice(list.guilds_id.indexOf(id), 1)

                        manager.updateWar(list)
                        message.channel.send(this.embed(`Removed guild id **${id}** from your target list.`))
                    }
                }
            }
            
            return
        }

        if(!list || list.guilds_id.length == 0){
            message.channel.send(this.embed(`You must add target guild first. Use ${this.prefix}war add <guild id>`))
            return
        }

        if(action == "list"){
            message.channel.send({embeds: [{
                title: 'Your guild target list',
                color: 'BLUE',
                description: list.guilds_id.join(", ")
            }]})
            return
        }

        const attackables = await manager.generateAttackables(list.guilds_id)

        if(!attackables.length){
            message.channel.send(this.embed('No players are currently attackable.'))
            return
        }

        const embed = {
            title: 'Attackable list (Count '+ attackables.length +')',
            color: 'BLUE',
            fields: [],
            footer: {
                text: 'Requested by '+ message.author.username,
                icon_url: message.author.displayAvatarURL()
            }
        }

        var content = '';

        attackables.sort((a, b) => b.level - a.level).forEach((attackable, index) => {
            const attId = attackable.user_id;
            const name = attackable.name;
            const level = attackable.level;

            const link = "https://web.simple-mmo.com/user/attack/"+ attId;

            content += `[${name}](${link}) lv. ${level} \n`
            
            if((index + 1) % 5 == 0 || (index + 1) == attackables.length){
                embed.fields.push({name: '\u200b', value: content, inline: true})
                content = '';
            }
        })

        message.channel.send({embeds: [embed]})
    }

    embed(message){
        return {
            embeds: [{
                color: 'BLUE',
                description: message
            }]
        }
    }
}

module.exports = War