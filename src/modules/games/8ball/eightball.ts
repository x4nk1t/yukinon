import CommandManager from '../../../CommandManager';
import { Message } from 'discord.js';
import Command from '../../../utils/Command';

class EightBall extends Command{
    replies: string[];
    
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: '8ball',
            description: 'Ask your questions to 8ball.',
            usage: '<question>',
            aliases: ['eb', '8b'],
        })

        this.replies = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes – definitely.','You may rely on it.','As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.']
    }

    execute(message: Message, commandArgs: string[]){
        if(commandArgs.length >= 1) {
            message.channel.send('🎱| '+ this.replies[Math.round(Math.random() * this.replies.length)])
        } else {
            message.channel.send('Come on! Ask something.')
        }
    }
}

export default EightBall;