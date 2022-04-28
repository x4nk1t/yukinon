import { Message, MessageEmbedOptions } from "discord.js";
import CommandManager from "../../../CommandManager";
import Command from "../../../utils/Command";
import TacoManager, { SauceDMInterface } from "../TacoManager";
/*
* TODO: add clear maybe?!
*/
class DMWhenCommand extends Command{
    sauceList: string[];
    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: 'dm-when',
            description: 'Get a DM when the prices is low or high!',
            aliases: ['dw'],
            usage: '<low|high> [sauce] <amount>'
        })

        this.sauceList = ['salsa', 'chipotle', 'hotsauce', 'pico', 'guac'];
    }

    async execute(message: Message, commandArgs: string[]) {
        const user_id = message.author.id;
        const manager : TacoManager = this.client.tacoManager;
        const highlow = commandArgs[0] ? commandArgs[0].toString() : null;

        if(highlow == "high"){
            const sauce = commandArgs[1] ? commandArgs[1].toLowerCase() : null;
            const amount = commandArgs[2] ? Number(commandArgs[2]) : null;

            if(!sauce || !amount || isNaN(Number(amount))) {
                this.sendUsage(message);
                return;
            }

            if(!this.sauceList.includes(sauce)){
                const embed: MessageEmbedOptions = {
                    color: 'BLUE',
                    description: 'Select any one sauce from below! \n'+ this.sauceList.join(', ')
                };

                message.channel.send({embeds: [embed]});
                return;
            }

            const embed: MessageEmbedOptions = {
                color: 'BLUE',
                description: 'Will dm you when the **'+ sauce +'** price is higher than '+ amount +'!'
            };

            var existingData = manager.dmWhens.get(user_id);

            if(existingData){
                existingData.forEach((data, index) => {
                    const existingHighlow = data.highlow;
                    const existingSauce = data.sauce;

                    if(existingHighlow == highlow && existingSauce == sauce){
                        existingData!.splice(index, 1);
                    }
                })
            } else {
                existingData = [];
            }

            const details: SauceDMInterface = {user_id: user_id, highlow: highlow, sauce: sauce, amount: amount};
            existingData.push(details)

            await manager.addDMWhens(user_id, highlow, sauce, amount);
            manager.dmWhens.set(user_id, existingData);

            message.channel.send({embeds: [embed]});
        } else if (highlow == "low"){
            const amount = commandArgs[1] ? Number(commandArgs[1]) : null;

            if(!amount || isNaN(Number(amount))) {
                this.sendUsage(message);
                return;
            }

            const embed: MessageEmbedOptions = {
                color: 'BLUE',
                description: 'Will dm you when the **one sauce** price is lower than **$'+ amount +'**!'
            };

            var existingData = manager.dmWhens.get(user_id);

            if(existingData){
                existingData.forEach((data, index) => {
                    const existingHighlow = data.highlow;
                    const existingSauce = data.sauce;

                    if(existingHighlow == highlow && existingSauce == "all"){
                        existingData!.splice(index, 1);
                    }
                })
            } else {
                existingData = [];
            }

            const details: SauceDMInterface = {user_id: user_id, highlow: highlow, sauce: "all", amount: amount};
            existingData.push(details)

            await manager.addDMWhens(user_id, highlow, "all", amount);
            manager.dmWhens.set(user_id, existingData);

            message.channel.send({embeds: [embed]});
        } else {
            this.sendUsage(message)
        }
    }
}

export default DMWhenCommand;