const Command = require("../../../utils/Command.js");


class WorldBosses extends Command {
    constructor(commandLoader){
        super(commandLoader, {
            name: 'worldbosses',
            description: 'Check the upcoming world bosses.',
            aliases: ['wb'],
        })
    }

    execute(message, commandArgs){
        const manager = this.client.smmoManager;
        const bosses = manager.worldboss;
        var description = '';

        if(!bosses.length){
            message.channel.send({embed: {color: 'BLUE', description: 'There are no world bosses.'}})
            return
        }

        bosses.sort((a,b) => a.enable_time - b.enable_time).forEach(boss => {
            const name = boss.name;
            const link = 'https://web.simple-mmo.com/worldboss/view/'+ boss.id;
            const level = boss.level;
            const now = new Date().getTime() / 1000;
            const diff = Math.round(boss.enable_time - now);
            
            if(diff > 0){
                description += `[${name}](${link}) (Level ${level}) \n - In ${manager.formatTime(diff)}\n`
            }
        })

        if(description == ''){
            message.channel.send({embed: {color: 'BLUE', description: 'There are no world bosses.'}})
            return
        }

        const embed = {
            title: 'World Bosses',
            url: 'https://web.simple-mmo.com/worldboss/all',
            color: 'BLUE',
            description: description,
            footer: {
                text: 'Requested by '+ message.author.username,
                icon_url: message.author.displayAvatarURL()
            }
        }

        message.channel.send({embed: embed})
    }
}

module.exports = WorldBosses