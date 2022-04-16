const Command = require('../../../utils/Command.js');
const Discord = require('discord.js');

class TacoRemindersCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "sauce-market",
            description: "Post taco sauce market to the channel",
            usage: "<add|remove>",
            aliases: ['sm'],
            permissions: ['MANAGE_CHANNELS']
        });
    }
    
    async execute(message, commandArgs){
        const manager = this.client.tacoManager;
        const channel = message.channel;
        const args = commandArgs[0];
        const addRemove = args ? args.toLowerCase() : null;

        if(!addRemove){
            this.sendUsage(message);
            return
        }

        if(addRemove == "add"){
            if(this.isSauceChannel(channel.id)){
                message.channel.send({embeds: [{color: 'BLUE', description: 'This is already a sauce channel.'}]})
                return
            }

            const result = await manager.addSauceChannel(channel.id);
            if(result) {
                manager.sauceChannels.set(channel.id, {last_updated: new Date().getTime()});
                message.channel.send({embeds: [{color: 'BLUE', description: `Successfully subscribed ${channel.toString()} to sauce market.`}]})
            } else {
                message.channel.send({embeds: [{color: 'BLUE', description: `Something went wrong while subscribing ${channel.toString()} to sauce market.`}]})
            }
        } else if(addRemove == "remove"){
            if(!this.isSauceChannel(channel.id)){
                message.channel.send({embeds: [{color: 'BLUE', description: 'This is not a sauce channel.'}]})
                return
            }
            
            const result = await manager.removeSauceChannel(channel.id);
            if(result) {
                manager.sauceChannels.delete(channel.id);
                message.channel.send({embeds: [{color: 'BLUE', description: `Successfully unsubscribed ${channel.toString()} from sauce market.`}]})
            } else {
                message.channel.send({embeds: [{color: 'BLUE', description: `Something went wrong while unsubscribing ${channel.toString()} to sauce market.`}]})
            }
        } else {
            this.sendUsage(message);
        }
    }

    isSauceChannel(channel_id){
        var found = false;
        this.client.tacoManager.sauceChannels.forEach((value, key) => {
            if(channel_id == key){
                found = true
                return
            }
        })
        return found
    }
}

module.exports = TacoRemindersCommand