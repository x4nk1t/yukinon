const discord = require('discord.js')

class ChatClearCommand {
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix+"chatclear <username|*>";
        this.description = "Clears the chat. (Requires permission)";
        
        this.authorizedUser = "x4nk1t#3701";
    }
    
    onCommand(message, commandArgs){
        const author = message.author.username + '#' + message.author.discriminator;
        const embed = new discord.MessageEmbed()
            .setColor("#00FF00")
            .setDescription('Deleting messages....')
        
        if(author == this.authorizedUser){
            if(commandArgs[0]){
                const user = commandArgs[0];
                message.delete({timeout: 3000})
                
                if(user == "*"){
                    message.channel.send(embed).then(msg => {
                        msg.delete({timeout: 3000})
                    })
                    
                    message.channel.messages.fetch().then(messages => {
                        const userMessages = messages.filter(msg => true);
                        message.channel.bulkDelete(userMessages)
                    })
                    return;
                } else {                    
                    message.channel.send(embed).then(msg => {
                        msg.delete({timeout: 3000})
                    })
                    
                    message.channel.messages.fetch().then(messages => {
                        const userMessages = messages.filter(msg => (msg.author.username == user));
                        message.channel.bulkDelete(userMessages)
                    })
                }
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setDescription('Usage: ' +this.usage)
                message.channel.send(embed)
            }
        } else {
            const embed = new discord.MessageEmbed()
                .setColor("#FF0000")
                .setDescription("You don't have permission to use this command!")
            message.channel.send(embed)
        }
    }
}

module.exports = ChatClearCommand