const Command = require('../../../utils/Command.js');

class Simulate extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'simulate',
            description: 'Simulate a PvP.',
            aliases: ['sim'],
            usage: '<player id> [player2 id]'
        })
    }

    async execute(message, commandArgs){
        const manager = this.client.smmoManager;
        var p1;
        var p2;

        if(commandArgs[0]){
            if(commandArgs[1]){
                p1 = commandArgs[0];
                p2 = commandArgs[1];
            } else {
                const profile = manager.profiles.get(message.author.id)

                if(!profile){
                    message.channel.send({embeds: [{color: 'BLUE', description: 'You must link your account first. OR you can use `!sim <your id> <player id>`'}]})
                    return
                } else {
                    p1 = profile.ingame_id;
                    p2 = commandArgs[0];
                }
            }

            if(p1 == p2){
                message.channel.send({embeds: [{color: 'BLUE', description: 'You cannot simulate pvp between same player.'}]})
                return
            }

            if(this.isValidInt(p1) && this.isValidInt(p2)){
                manager.sendRequest('post', '/player/info/'+ p1).then(response => {
                    if(response.data.error && response.data.error == 'user not found'){
                        message.channel.send({embeds: [{color: 'BLUE', description: 'User with id **'+ p1 +'** not found.'}]})
                        return
                    }
                    manager.sendRequest('post', '/player/info/'+ p2).then(response2 => {
                        if(response2.data.error && response2.data.error == 'user not found'){
                            message.channel.send({embeds: [{color: 'BLUE', description: 'User with id '+ p2 +' not found.'}]})
                            return
                        }
                        const battles = []

                        var p1_data = response.data;
                        var p2_data = response2.data;

                        for(var i = 0; i < 20; i++){
                            battles.push(this.simulatePVP(p1_data, p2_data))
                        }

                        message.channel.send({embeds: [this.battleEmbed(battles)]})
                    })
                })
            }
        } else {
            this.sendUsage(message)
        }
    }

    isValidInt(id){
        return !isNaN(id) && !isNaN(parseFloat(id))
    }

    battleEmbed(battles){
        const d = battles[0]
        var description = '';
        
        const p1_attack = '[Attack](https://web.simple-mmo.com/user/attack/'+d.p1.id+')'
        const p1_profile = '[Profile](https://web.simple-mmo.com/user/view/'+d.p1.id+')'

        const p2_attack = '[Attack](https://web.simple-mmo.com/user/attack/'+d.p2.id+')'
        const p2_profile = '[Profile](https://web.simple-mmo.com/user/view/'+d.p2.id+')'

        description += `**${d.p1.name}** (Lv. ${d.p1.level}) [${p1_attack} | ${p1_profile}] \n`;
        description += `**Damage:** ${d.p1_damage} \n`;
        description += `**Hit Chance:** ${d.p1_hitchance.toFixed(2)}% \n\n`;

        description += `**${d.p2.name}** (Lv. ${d.p2.level}) [${p2_attack} | ${p2_profile}] \n`;
        description += `**Damage:** ${d.p2_damage} \n`;
        description += `**Hit Chance:** ${d.p2_hitchance.toFixed(2)}% \n\n`;

        const battles_not_completed = battles.filter((b) => b.battle_completed == false);
        const won_by_p1 = battles.filter((b) => b.wonBy == d.p1.name)
        const won_by_p2 = battles.filter((b) => b.wonBy == d.p2.name)
        
        description += '**Simulating 20 battles!**\n'
        description += '**'+d.p1.name +' WON:** '+ won_by_p1.length +' battles\n'
        
        description += '**'+d.p2.name +' WON:** '+ won_by_p2.length + ' battles\n\n'

        if(battles_not_completed.length) description += '**Couldn\'t complete '+ battles_not_completed.length +' battles in 100 hits each!**'

        return {
            color: 'BLUE',
            title: d.p1.name +' vs '+ d.p2.name,
            description: description
        }
    }

    simulatePVP(p1_data, p2_data){
        var details = {};

        details.p1 = p1_data;
        details.p2 = p2_data;

        const p1_maxhp = p1_data.max_hp;
        const p1_total_str = p1_data.str + p1_data.bonus_str;
        const p1_total_def = p1_data.def + p1_data.bonus_def;
        const p1_total_dex = p1_data.dex + p1_data.bonus_dex;

        const p2_maxhp = p2_data.max_hp;
        const p2_total_str = p2_data.str + p2_data.bonus_str;
        const p2_total_def = p2_data.def + p2_data.bonus_def;
        const p2_total_dex = p2_data.dex + p2_data.bonus_dex;

        details.p1_maxhp = p1_maxhp;
        details.p2_maxhp = p2_maxhp;

        var maxDamage1to2 = Math.round(p1_total_str - (9/11)*p2_total_def);
        var minDamage1to2 = Math.round(p1_total_str - (11/9)*p2_total_def);

        var maxDamage2to1 = Math.round(p2_total_str - (9/11)*p1_total_def);
        var minDamage2to1 = Math.round(p2_total_str - (11/9)*p1_total_def);

        var p1ChanceToHit = ((7/2)*(p1_total_dex/p2_total_def) * 100);
        var p2ChanceToHit = ((7/2)*(p2_total_dex/p1_total_def) * 100);

        details.p1_hitchance = p1ChanceToHit;
        details.p2_hitchance = p2ChanceToHit;
        
        if(minDamage1to2 < 1) minDamage1to2 = 1;
        if(maxDamage1to2 < 20) maxDamage1to2 = 20;
        if(minDamage2to1 < 1) minDamage2to1 = 1;
        if(maxDamage2to1 < 20) maxDamage2to1 = 20;

        details.p1_damage = `${minDamage1to2} - ${maxDamage1to2}`
        details.p2_damage = `${minDamage2to1} - ${maxDamage2to1}`

        var p1_sim_hp = p1_maxhp;
        var p2_sim_hp = p2_maxhp;
        
        for(var i = 0; i < 100; i++){
            const p1_rng = Math.floor(Math.random() * 100);
            const p2_rng = Math.floor(Math.random() * 100);

            if(p1_rng <= p1ChanceToHit){
                const p1_damage_rng = Math.round(Math.random() * (maxDamage1to2 - minDamage1to2) + minDamage1to2);

                p2_sim_hp -= p1_damage_rng;
            }

            if(p2_rng <= p2ChanceToHit){
                const p2_damage_rng = Math.round(Math.random() * (maxDamage2to1 - minDamage2to1) + minDamage2to1);

                p1_sim_hp -= p2_damage_rng;
            }

            if(p1_sim_hp <= 0 || p2_sim_hp <= 0){
                details.hitsTaken = i;
                details.battle_completed = true;

                if(p1_sim_hp > p2_sim_hp){
                    details.wonBy = p1_data.name;
                } else if(p1_sim_hp < p2_sim_hp){
                    details.wonBy = p2_data.name;
                } else if (p1_sim_hp == p2_sim_hp){
                    details.wonBy = 'TIED';
                }
                break;
            }

            if(i == 99 && p1_sim_hp > 0 && p2_sim_hp > 0){
                details.battle_completed = false;
                break;
            }
        }
        
        return details;
    }
}

module.exports = Simulate