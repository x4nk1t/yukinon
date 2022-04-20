import { EmbedField, Message, MessageEmbedOptions, MessageOptions } from "discord.js";

import CommandManager from "../../CommandManager";
import Command from '../Command';
import {createReactionCollector} from '../../Functions';

class Help extends Command{
    commandContent: EmbedField[];
    commandPerPage: number;

    constructor(commandManager: CommandManager){
        super(commandManager, {
            name: 'help',
            description: 'Help command',
            usage: '[page|command]',
            aliases: ['?']
        })

        this.commandContent = [];
        this.commandPerPage = 8;
    }

    async execute(message: Message, commandArgs: string[]){
        if(!this.commandContent.length){
            this.commandManager.commands.sort((a,b) => {
                    if(a.options.name > b.options.name) return 1;
                    if(b.options.name > a.options.name) return -1;
                    return 0
                }).each(command => {
                    if(command.options.showInHelp){
                        this.commandContent.push({name: command.options.name, value: command.options.description, inline: false});
                    }
            })
        }
        var page = 0;
        var arg = commandArgs[0] ? commandArgs[0].toLowerCase() : null;

        if(arg){
            if(!Number.isNaN(arg) && !isNaN(parseFloat(arg))){
                page = Number(arg) - 1;
            } else {
                var command = this.commandManager.getCommand(arg);
                if(command){
                    message.channel.send({
                        embeds: [{
                            title: `${command.options.name} command`,
                            color: 'BLUE',
                            fields: [
                                {name: 'Command Name', value: command.options.name},
                                {name: 'Description', value: command.options.description},
                                {name: 'Usage', value: command.options.name +' '+ command.options.usage},
                                {name: 'Aliases', value: command.options.aliases.join(', ')},
                            ]
                        }]
                    })
                } else {
                    message.channel.send({embeds: [{color: 'RED', description: 'Command not found!'}]});
                }
                return;
            }
        }

        const lastPage = Math.floor(this.commandContent.length / this.commandPerPage);
        
        if(page > lastPage || page < 0){
            message.channel.send({embeds: [{color: 'BLUE', description: 'Total Page: '+ (lastPage + 1)}]});
            return;
        }

        var embed: MessageOptions = {embeds: [{
            title: 'Yukino Commands',
            color: 'BLUE',
            fields: this.getPage(page),
            footer: {text: `Requested by ${message.author.username} • Page (${page + 1}/${(lastPage + 1)})`, icon_url: message.author.displayAvatarURL()}
        }]};

        const firstPage = await message.channel.send(embed);
        createReactionCollector(message, firstPage, lastPage, (page: number) => {
            var embed2: MessageEmbedOptions = {
                title: 'Yukino Commands',
                color: 'BLUE',
                fields: this.getPage(page),
                footer: {text: `Requested by ${message.author.username} • Page (${page + 1}/${lastPage + 1})`, icon_url: message.author.displayAvatarURL()}
            };
            //{embeds: };

            firstPage.edit({embeds: [embed2]});
        })
    }

    getPage(page: number){
        var fields = [];
        var start = page * this.commandPerPage;

        for(var i = start; i < (start + this.commandPerPage); i++){
            var command = this.commandContent[i];
            if(!command) continue;
            fields.push(command);
        }

        return fields;
    }
}

export default Help;