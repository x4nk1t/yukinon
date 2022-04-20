import { Message } from "discord.js";
import CommandManager from "../../CommandManager";
import {inspect} from 'util';

import Command from '../Command';

class Eval extends Command{
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: "eval",
            description: "Eval command.",
            aliases: ['eval'],
            showInHelp: false
        });
    }
    
    async execute(message: Message, commandArgs: string[]){
        if(this.client.owners.includes(message.author.id) && commandArgs.length >= 1){
            const split = message.content.split(' ')
            split.shift()
            const evalContent = split.join(' ')

            if(evalContent.toLowerCase().includes('token')){
                message.channel.send({embeds: [{color: 'BLUE', description: 'Cannot parse content with **token** word.'}]})
                return
            }

            try {
                let evaled = eval(evalContent)

                if(typeof evaled != "string") evaled = inspect(evaled)

                message.channel.send(this.clean(evaled));
            } catch(err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(String(err))}\n\`\`\``)
            }
        } else {
            message.channel.send({embeds: [{description: 'You don\'t have permission for this command. <:pooh:789404954430668821>', color: 'BLUE'}]})
        }
    }

    clean(text: string): string{
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
}

export default Eval;