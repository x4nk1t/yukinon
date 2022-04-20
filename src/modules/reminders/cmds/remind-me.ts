import CommandManager from '../../../CommandManager';
import { Message } from 'discord.js';
import Command from '../../../utils/Command';

class RemindMe extends Command{
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "remind-me",
            description: "Set a reminder.",
            aliases: ['rm'],
            usage: '<time> <reminder>'
        });
    }

    async execute(message: Message, commandArgs: string[]){
        if(commandArgs.length >= 2){
            const manager = this.client.reminderManager!;
            const time = this.parseTime(commandArgs[0]);
            commandArgs.shift()

            const reminder = commandArgs.join(' ')

            if(isNaN(time) && isNaN(parseFloat(String(time)))){
                message.channel.send({embeds: [{color: 'BLUE', description: 'Invalid time!\nMake sure time is in following format: 1d4h5m1s'}]})
                return
            }
        
            const timeAt = (new Date().getTime() + time);
            const add = await manager.addReminder(message.author.id, reminder, timeAt, message.channel.id)

            if(add){
                message.channel.send({embeds: [{color: 'BLUE', description: message.author.toString() +', Reminder set successfully!'}]})
            } else {
                message.channel.send({embeds: [{color: 'BLUE', description: message.author.toString() +', Something went wrong! Try again in few seconds!'}]})
            }
        } else {
            this.sendUsage(message)
        }
    }

    parseTime(time: string){
        var currentBuffer = '0';
        var split = time.split('')

        var days = 0;
        var hours = 0;
        var minutes = 0;
        var seconds = 0;

        split.forEach((str: string) => {
            switch(str){
                case 'd':
                    days = parseInt(currentBuffer)
                    currentBuffer = '0';
                break;

                case 'h':
                    hours = parseInt(currentBuffer)
                    currentBuffer = '0';
                break;

                case 'm':
                    minutes = parseInt(currentBuffer)
                    currentBuffer = '0';
                break;

                case 's':
                    seconds = parseInt(currentBuffer)
                    currentBuffer = '0';
                break;

                default:
                    try{
                        var num = parseInt(str)
                        currentBuffer += num
                    } catch {
                        return null
                    }
                break;
            }
        });

        return (1000 * (seconds + (minutes * 60) + (hours * 3600) + (days * 86400) + parseInt(currentBuffer)))
    }
}

export default RemindMe