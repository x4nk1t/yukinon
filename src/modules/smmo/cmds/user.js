const Command = require('../../../utils/Command.js')
const api_key = process.env.api_key;

class Volume extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'user',
            description: 'Check smmo user with id.',
            usage: '<id>',
            aliases: ['u']
        })
    }

    async execute(message, commandArgs){
        const manager = this.client.smmoManager;

        if(commandArgs[0]){
            var id = commandArgs[0];
            if(!isNaN(id) && !isNaN(parseFloat(id))){
                manager.sendRequest('post', 'https://api.simple-mmo.com/v1/player/info/'+ id)
                    .then(response => {
                        const data = response.data;
                        
                        if(data.error == 'user not found'){
                            message.channel.send({embed: {color: 'BLUE', description: 'User not found.'}})
                            return
                        }

                        const profile_number = data.profile_number != null ? "#"+ data.profile_number : '';
                        const guild = data.guild ? `[${data.guild.name}](https://web.simple-mmo.com/guilds/view/${data.guild.id})` : 'None';

                        const embed = {
                            title: data.name + profile_number,
                            color: 'BLUE',
                            url: 'https://web.simple-mmo.com/user/view/'+ id,
                            description: `*${data.motto}*\n[[Attack]](https://web.simple-mmo.com/user/attack/${id}) [[Message]](https://web.simple-mmo.com/messages/view/user/${id}) [[Send Gold]](https://web.simple-mmo.com/sendgold/${id}) [[Send Item]](https://web.simple-mmo.com/inventory?sendid=${id})`,
                            fields: [
                                {name: 'Level', value: data.level.toLocaleString(), inline: true},
                                {name: 'Gold', value: data.gold.toLocaleString(), inline: true},
                                {name: 'Steps', value: data.steps.toLocaleString(), inline: true},
                                {name: 'Strength', value: data.str.toLocaleString() + ` (+${data.bonus_str.toLocaleString()})`, inline: true},
                                {name: 'Defence', value: data.def.toLocaleString() + ` (+${data.bonus_def.toLocaleString()})`, inline: true},
                                {name: 'Dexterity', value: data.dex.toLocaleString() + ` (+${data.bonus_dex.toLocaleString()})`, inline: true},
                                {name: 'User Kills', value: data.user_kills.toLocaleString(), inline: true},
                                {name: 'NPC Kills', value: data.npc_kills.toLocaleString(), inline: true},
                                {name: 'Quests Completed', value: data.quests_complete.toLocaleString(), inline: true},
                                {name: 'Safe mode' , value: data.safeMode == 0 ? "No" : "Yes", inline: true},
                                {name: 'Guild', value: guild, inline: true},
                            ],
                            footer: {
                                text: 'Requested by '+ message.author.username,
                                icon_url: message.author.displayAvatarURL() 
                            }
                        }
                        if(data.safeModeTime){
                            embed.fields.push({name: 'Safe Mode Time <:idk:769065058788442112>', value: data.safeModeTime, inline: true})
                        }
                        message.channel.send({embed: embed})
                    }).catch(err => {
                        console.error(err)
                        message.channel.send({color: 'BLUE', description: 'Something went wrong. Try again later.'})
                    })
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = Volume