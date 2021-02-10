const Discord = require('discord.js');

const Reminder = require('./models/reminder.js')

class ReminderManager {
    constructor(client){
        this.client = client;

        this.reminders = []
        this.remindersTimeout = new Discord.Collection()

        this.run()
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
                    const timeout = setTimeout(() => {
                        this.sendReminder(reminder)
                    }, diff)

                    this.remindersTimeout.set(id, timeout)
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

        await this.removeReminder(id)
        this.remindersTimeout.delete(id)
        this.reminders.forEach((rm, index) => {
            if(rm._id == id){
                this.reminders.splice(index, 1)
            }
        })

        const user = this.client.users.cache.get(user_id);
        
        if(!user) return

        user.send({embed: {color: 'BLUE', description: '**Reminder:** '+ reminder}})
    }

    addReminder(user_id, reminder, time){
        return new Promise(async (resolve, reject) => {
            const obj = {user_id: user_id, reminder: reminder, time: time};

            Reminder.collection.insertOne(obj, (err, response) => {
                if(err){
                    this.client.logger.error("Something went wrong while inserting reminder.")
                    reject(err)
                }
                const id = response.insertedId;

                obj._id = id;
                this.reminders.push(obj)

                const remainingTime = (time - new Date().getTime())

                const timeout = setTimeout(() => { this.sendReminder(obj) }, remainingTime)
                this.remindersTimeout.set(id, timeout)
                
                resolve(true)
            })
        })
    }

    removeMany(options){
        return new Promise((resolve, reject) => {
            Reminder.collection.removeMany({
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