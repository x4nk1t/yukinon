import { Message, PresenceStatusData } from "discord.js";
import CommandManager from "../../CommandManager";

import Command from '../Command';
import botSettings from '../models/bot-settings';

class ChangeStatus extends Command{
    statuses: string[];

    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "change-status",
            description: "Change status of bot.",
            aliases: ['cs'],
            showInHelp: false
        });

        this.statuses = ['online', 'dnd', 'idle', 'invisible']
    }

    async execute(message: Message, commandArgs: string[]){
        if(this.client.authorizedUsers.includes(message.author.id) && commandArgs[0]){
            const status: PresenceStatusData = <PresenceStatusData> commandArgs[0].toLowerCase();

            if(!this.statuses.includes(status)) return;

            this.client.user!.setStatus(status)
            
            botSettings.collection.findOneAndUpdate({name: 'status'}, {$set: {value: status}}, err => {
                if(err) console.log(err);
            })

            await message.react('✅');
            setTimeout(() => { message.delete() }, 1000);
        }
    }
}

export default ChangeStatus;