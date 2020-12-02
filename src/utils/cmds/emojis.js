const Command = require('../Command.js');

class Emojis extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "emojis",
            description: "Returns emoji list of this server.",
            aliases: ['emjs'],
            guildOnly: true
        });
    }

    execute(message, commandArgs){
        var embed = { footer: {text: `Requested by ${message.author.username}`, icon_url: message.author.displayAvatarURL()}}
        const guild = message.guild;

        if(guild.emojis.cache.size){
            var animated = [];
            var normal = [];
            
            guild.emojis.cache.forEach(emoji => {
                if(emoji.animated) animated.push(emoji.toString()); else normal.push(emoji.toString());
            });

            embed.title = guild.name + '\'s Emojis'
            embed.description = '**Static Emojis** \n'+ normal.join(' ') + '\n\n **Animated Emojis**\n'+ animated.join(' ');

            message.channel.send({embed: embed})
        } else {
            embed.description = 'This guild doesn\'t have any emojis.';
            message.channel.send({embed: embed})
        }
    }
}

module.exports = Emojis
