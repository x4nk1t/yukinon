import { Collection, Snowflake, TextChannel } from 'discord.js';

import RemindMeCommand from './cmds/remind-me.js';
import CheckReminderCommand from './cmds/check-reminders.js';

import Reminders from './models/reminder.js';
import Client from '../../Client.js';
import CommandManager from '../../CommandManager.js';

interface ReminderInterface{
    _id?: string;
    time: number;
    user_id: string;
    reminder: string;
    channel_id: string;
}

class ReminderManager {
    client: Client;
    reminders: any[];
    remindersTimeout: Collection<Snowflake, NodeJS.Timeout>;
    commandManager: CommandManager;

    constructor(client: Client){
        this.client = client;

        this.reminders = [];
        this.remindersTimeout = new Collection();
        this.commandManager = client.commandManager;

        this.loadCommands()
        this.run()
    }

    loadCommands(){
        this.commandManager.loadCommand(new RemindMeCommand(this.commandManager))
        this.commandManager.loadCommand(new CheckReminderCommand(this.commandManager))
    }

    async run(){
        const cursor = Reminders.collection.find({});
        const arr = await cursor.toArray();
        
        const toRemove: string[] = [];
        this.reminders = arr;

        arr.forEach((reminder: any) => {
            const id = reminder._id;
            const time = reminder.time;
            const diff = (time - new Date().getTime())

            if(diff > 0){ 
                if(diff < 172800000){
                    const timeout = setTimeout(() => {
                        this.sendReminder(reminder)
                    }, diff)

                    this.remindersTimeout.set(id, timeout)
                }
            } else {
                this.sendReminder(reminder)
                toRemove.push(id)
            }
        })

        if(toRemove.length) await this.removeMany(toRemove)
    }

    async sendReminder(obj: ReminderInterface){
        const id = obj._id;
        const user_id = obj.user_id;
        const reminder = obj.reminder;
        const channel = <TextChannel>this.client.channels.cache.get(obj.channel_id)

        const user = this.client.users.cache.get(user_id);
        if(!user) return

        if(channel){
            channel.send(`Reminder ${user.toString()}: ${reminder}`)
        } else {
            user.send('**Reminder:** '+ reminder)
        }

        await this.removeReminder(id!)
        this.remindersTimeout.delete(id!)
        this.reminders.forEach((rm: ReminderInterface, index: number) => {
            if(rm._id == id){
                this.reminders.splice(index, 1)
            }
        })
    }

    addReminder(user_id: string, reminder: string, time: number, channel_id: string){
        return new Promise(async (resolve, reject) => {
            const obj: any = {user_id: user_id, reminder: reminder, time: time, channel_id: channel_id};

            Reminders.collection.insertOne(obj, (err, response) => {
                if(err){
                    this.client.logger.error("Something went wrong while inserting reminder.")
                    reject(err)
                }
                const id = response?.insertedId;

                obj._id = String(id);
                this.reminders.push(obj)

                const diff = (time - new Date().getTime())

                if(diff > 0 && diff < 172800000){
                    const timeout = setTimeout(() => { this.sendReminder(obj) }, diff)
                    this.remindersTimeout.set(String(id), timeout)
                }
                
                resolve(true)
            })
        })
    }

    removeMany(options: any[]){
        return new Promise((resolve, reject) => {
            Reminders.collection.deleteMany({
                _id: {
                    $in: options
                }
            }, err => {
                if(err){
                    this.client.logger.error(String(err))
                    reject({message: 'Failed to remove many timer.'})
                    return
                }
                resolve({message: 'Successfully removed many timer.'})
            })
        })
    }

    removeReminder(id: string){
        return new Promise((resolve, reject) => {
            Reminders.collection.deleteOne({_id: id}, err => {
                if(err){
                    this.client.logger.error('Something went wrong while removing a reminder.'+ id)
                    reject(err)
                }
                resolve(true)
            })
        })
    }
}

export default ReminderManager;