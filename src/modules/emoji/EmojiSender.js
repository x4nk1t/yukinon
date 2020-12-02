class EmojiSender {
    constructor(client){
        this.client = client;
    }
    
    run(){
        this.client.on('message', message => {
            if(message.author.bot) return
            
            var content = message.content;
            var emojis = message.guild.emojis.cache;
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
