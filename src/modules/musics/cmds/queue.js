const Command = require('../../../utils/Command.js')

class Queue extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'queue',
            description: 'Check the queue list.',
            aliases: ['q'],
            guildOnly: true
        })
    }

    async execute(message, commandArgs){
        const member = message.member;
        const manager = this.client.musicManager;

        if(member.voice.channel){
            const voiceChannel = member.voice.channel;
            const queue = manager.queue.get(voiceChannel.id);
            var description = '';

            if(!queue){
                message.channel.send(this.embed(`The channel you\'re conneting doesn't have any queue. Use \`play <link>\`.`))
                return
            }

            queue.queues.forEach((q, index) => {
                var current = '';
                if(index == 0) current = '**<- Playing**';
                description += `**${index + 1}.** ${this.shortText(q.title)} ${current}\n`
            })

            message.channel.send(this.embed(description))
        } else {
            message.channel.send(this.embed('You must be connected to voice channel.'))
        }
    }

    shortText(text, length = 40) {
        if (text == null) {
            return "";
        }
        if (text.length <= length) {
            return text;
        }
        text = text.substring(0, length);
        var last = text.lastIndexOf(" ");
        text = text.substring(0, last);
        return text + "...";
    }

    embed(message){
        return {embed: {color: 'BLUE', description: message}}
    }
}

module.exports = Queue