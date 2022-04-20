import { GuildEmoji, MessageReaction, User } from "discord.js";
import Client from "../../Client";

class EmojiSender {
    client: Client;

    constructor(client: Client){
        this.client = client;

        this.run()
    }
    
    run(){
        this.client.on('messageCreate', message => {
            if(message.author.bot || !message.guild) return
            
            var content = message.content;
            var emojis = message.guild.emojis.cache;
            var suffix = '__react';

            if(emojis.size == 0) return;

            if(content.toLowerCase().endsWith(suffix)){
                const emojiName = content.slice(0, (suffix.length * -1))

                emojis.forEach(async emoji => {
                    if(emojiName.toLowerCase() == emoji.name?.toLowerCase()){
                        if(emoji.animated){
                            const messages = await message.channel.messages.fetch({limit: 2})
                            const lastMessage = messages.last()
                            if(lastMessage){
                                lastMessage.react(emoji)
                                const reactionCollector = lastMessage.createReactionCollector({filter: (reaction: MessageReaction, user: User) => {return reaction.emoji.name == emoji.name && !user.bot;}, time: 30000 })
                                reactionCollector.on('collect', reaction => {
                                    reaction.users.remove(this.client.user!);
                                    reactionCollector.stop();
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
                if(content.toLowerCase() == emoji.name?.toLowerCase()){
                    var animated = ''
                    if(emoji.animated){
                        animated = 'a'
                    }
                    message.channel.send('<'+ animated +':'+ emoji.name +':'+ emoji.id +'>')
                    return false;
                }
                return true;
            })
        })
    }
}

export default EmojiSender;
