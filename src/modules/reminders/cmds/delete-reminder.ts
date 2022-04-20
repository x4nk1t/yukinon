import { Message } from 'discord.js';
import CommandManager from '../../../CommandManager';
import Command from '../../../utils/Command';
import ReminderManager, { ReminderInterface } from '../ReminderManager';

class DeleteReminder extends Command{
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "delete-reminder",
            description: "Delete your reminder.",
            aliases: ['dr'],
            usage: '<reminder id>'
        });
    }

    async execute(message: Message, commandArgs: string[]){
        const manager: ReminderManager = this.client.reminderManager!;

        if(commandArgs[0]){
            const id = commandArgs[0];
            const reminders = manager.reminders.filter((re: { _id: string; user_id: string; }) => (re._id == id && re.user_id == message.author.id))
            if(reminders.length){
                const reminder_id = reminders[0]._id;
                
                await manager.removeReminder(reminder_id);
                manager.remindersTimeout.delete(id)
                manager.reminders.forEach((rm: ReminderInterface, index: number) => {
                    if(rm._id == id){
                        manager.reminders.splice(index, 1)
                    }
                })

                message.channel.send({embeds: [{color: 'BLUE', description: 'Successfully removed `'+ reminders[0].reminder +'` reminder!'}]})
            } else {
                message.channel.send({embeds: [{color: 'BLUE', description: 'Reminder not found!\nMake sure you\'re using right id from `'+ this.prefix +'cr` \n **Note:** You cannot view/delete others reminders.'}]})
            }
        } else {
            this.sendUsage(message);
        }
    }
}

export default DeleteReminder;