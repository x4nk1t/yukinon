class EmojiSender {
    constructor(client){
        this.client = client;
    }
    
    run(){
        this.client.on('message', message => {
            if(message.author.bot && !message.guild) return
            
            var content = message.content;
            var emojis = message.guild.emojis.cache;
            var suffix = '__react';

            if(content.toLowerCase().endsWith(suffix)){
                const emojiName = content.slice(0, (suffix.length * -1))

                emojis.forEach(async emoji => {
                    if(emojiName.toLowerCase() == emoji.name.toLowerCase()){
                        if(emoji.animated){
                            const messages = await message.channel.messages.fetch({limit: 2})
                            const lastMessage = messages.last()
                            if(lastMessage){
                                lastMessage.react(emoji)
                                const reactionCollector = lastMessage.createReactionCollector((reaction, user) => reaction.emoji.name == emoji.name && !user.bot, { time: 30000 })
                                reactionCollector.on('collect', reaction => {
                                    reaction.users.remove(this.client.user)
                                    reactionCollector.stop()
                                })
                            }
                            message.delete()
                            return
                        }
                    }
                })
                return
            }

            emojis.some(emoji => {
                if(content.toLowerCase() == emoji.name.toLowerCase()){
                    var animated = ''
                    if(emoji.animated){
                        animated = 'a'
                    }
                    message.channel.send('<'+ animated +':'+ emoji.name +':'+ emoji.id +'>')
                    return
                }
            })
        })
    }
}

module.exports = EmojiSender
