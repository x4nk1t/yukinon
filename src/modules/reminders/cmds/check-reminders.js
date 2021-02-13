const Command = require('../../../utils/Command.js');

class CheckReminder extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "check-reminders",
            description: "Check your reminders.",
            aliases: ['cr'],
            usage: '[reminder id]',
            guildOnly: false
        });
    }

    async execute(message, commandArgs){
        const manager = this.client.reminderManager;

        if(commandArgs[0]){
            const id = commandArgs[0];
            const reminders = manager.reminders.filter(re => (re._id == id && re.user_id == message.author.id))

            if(reminders.length){
                const reminder = reminders[0];
                const now = new Date().getTime()
                const time = reminder.time - now;
                const embed = {
                    color: 'BLUE',
                    title: message.author.username +'\'s reminder',
                    fields: [
                        {name: 'ID', value: id},
                        {name: 'Reminder', value: reminder.reminder},
                        {name: 'Time left', value: this.formatTime(time)}
                    ],
                    footer: {
                        text: 'Requested by '+ message.author.username,
                        icon_url: message.author.displayAvatarURL()
                    }
                }

                message.channel.send({embed: embed})
            } else {
                message.channel.send({embed: {color: 'BLUE', description: 'Make sure you\'re using right id from `'+ this.prefix +'cr` \n **Note:** You cannot view others reminders.'}})
            }
        } else {
            const id = message.author.id;
            const reminders = manager.reminders.filter(re => re.user_id == id);

            if(reminders.length){
                const now = new Date().getTime()
                var description = '';
                reminders.forEach(reminder => {
                    const inMS = reminder.time - now;
                    
                    description += `${this.shortText(reminder.reminder)} - In ${this.formatTime(inMS)} [ID: ${reminder._id}]\n`;
                })
                message.channel.send({embed: {color: 'BLUE', title: message.author.username +'\'s Reminders', description: description, footer: {text: 'You can get reminder detail with `'+ this.prefix +'cr <id>` command'}}})
            } else {
                message.channel.send({embed: {color: 'BLUE', description: 'You don\'t have any reminders.'}})
            }
        }
    }

    shortText(text, length = 20) {
        if (text == null) {
            return "";
        }
        if (text.length <= length) {
            return text;
        }
        text = text.substring(0, length);
        var last = text.lastIndexOf(" ");
        if(last != -1) text = text.substring(0, last);
        return text + "...";
    }

    formatTime(date_in_ms){
        var delta = Math.abs(date_in_ms / 1000);

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        
        var seconds = Math.round(delta % 60);
        
        return (days +'d '+ hours +'h '+ minutes + 'm '+ seconds + 's')
    }
}

module.exports = CheckReminder