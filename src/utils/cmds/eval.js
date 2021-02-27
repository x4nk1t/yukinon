const Command = require('../Command.js');

class Eval extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "eval",
            description: "Eval command.",
            aliases: ['eval'],
            showInHelp: false
        });
    }
    
    async execute(message, commandArgs){
        if(this.client.owners.includes(message.author.id) && commandArgs.length >= 1){
            const split = message.content.split(' ')
            split.shift()
            const evalContent = split.join(' ')

            if(evalContent.toLowerCase().includes('token')){
                message.channel.send({embed: {color: 'BLUE', description: 'Cannot parse content with **token** word.'}})
                return
            }

            try {
                let evaled = eval(evalContent)

                if(typeof evaled != "string") evaled = require('util').inspect(evaled)

                message.channel.send(this.clean(evaled), {code: 'x1'})
            } catch(err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(err)}\n\`\`\``)
            }
        } else {
            message.channel.send({embed: {description: 'You don\'t have permission for this command. <:pooh:789404954430668821>', color: 'BLUE'}})
        }
    }

    clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
}

module.exports = Eval