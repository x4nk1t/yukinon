const Discord = require('discord.js');

const RemindMeCommand = require('./cmds/remind-me.js')
const CheckReminderCommand = require('./cmds/check-reminders.js')

const Reminder = require('./models/reminder.js')

class ReminderManager {
    constructor(client){
        this.client = client;

        this.reminders = []
        this.remindersTimeout = new Discord.Collection()
        this.cmdManager = client.commandManager;

        this.loadCommands()
        this.run()
    }

    loadCommands(){
        this.cmdManager.loadCommand(new RemindMeCommand(this.cmdManager))
        this.cmdManager.loadCommand(new CheckReminderCommand(this.cmdManager))
    }

    run(){
        Reminder.collection.find({}, async (err, data) => {
            if(err){
                this.client.logger.error('Couldn\'t load reminder data.')
                setTimeout(() => { this.run() }, 10000) //Try again in 10sec
            }
            const arr = await data.toArray()
            const toRemove = []
            this.reminders = arr;

            arr.forEach(reminder => {
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
                    toRemove.push(id)
                }
            })

            if(toRemove.length) await this.removeMany(toRemove)
        })
    }

    async sendReminder(obj){
        const id = obj._id;
        const user_id = obj.user_id;
        const reminder = obj.reminder;
        const channel = this.client.channels.cache.get(obj.channel_id)

        const user = this.client.users.cache.get(user_id);
        if(!user) return

        if(channel){
            channel.send(`Reminder ${user.toString()}: ${reminder}`)
        } else {
            user.send('**Reminder:** '+ reminder)
        }

        await this.removeReminder(id)
        this.remindersTimeout.delete(id)
        this.reminders.forEach((rm, index) => {
            if(rm._id == id){
                this.reminders.splice(index, 1)
            }
        })
    }

    addReminder(user_id, reminder, time, channel_id){
        return new Promise(async (resolve, reject) => {
            const obj = {user_id: user_id, reminder: reminder, time: time, channel_id: channel_id};

            Reminder.collection.insertOne(obj, (err, response) => {
                if(err){
                    this.client.logger.error("Something went wrong while inserting reminder.")
                    reject(err)
                }
                const id = response.insertedId;

                obj._id = id;
                this.reminders.push(obj)

                const diff = (time - new Date().getTime())

                if(diff > 0 && diff < 172800000){
                    const timeout = setTimeout(() => { this.sendReminder(obj) }, diff)
                    this.remindersTimeout.set(id, timeout)
                }
                
                resolve(true)
            })
        })
    }

    removeMany(options){
        return new Promise((resolve, reject) => {
            Reminder.collection.deleteMany({
                _id: {
                    $in: options
                }
            }, err => {
                if(err){
                    this.client.logger.error(err)
                    reject({message: 'Failed to remove many timer.'})
                    return
                }
                resolve({message: 'Successfully removed many timer.'})
            })
        })
    }

    removeReminder(id){
        return new Promise((resolve, reject) => {
            Reminder.collection.deleteOne({_id: id}, err => {
                if(err){
                    this.client.logger.error('Something went wrong while removing a reminder.'+ id)
                    reject(err)
                }
                resolve(true)
            })
        })
    }
}

module.exports = ReminderManager;