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
                message.channel.send({embed: {color: 'BLUE', description: 'Even if you are authorized user, I cannot eval content with word **token** in it.'}})
                return
            }

            try {
                eval(evalContent)
            } catch(err) {
                message.channel.send({embed: {color: 'BLUE', description: err.name + ': '+ err.message}})
            }
        } else {
            message.channel.send({embed: {description: 'You don\'t have permission for this command. <:pooh:789404954430668821>', color: 'BLUE'}})
        }
    }
}

module.exports = Eval