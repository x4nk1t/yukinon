class EmojiSender {
    constructor(client){
        this.client = client;
    }
    
    run(){
        this.client.on('messageCreate', message => {
            if(message.author.bot) return
            
            var content = message.content;
            var emojis = message.channel.guild.emojis;
            emojis.some(emoji => {
                if(content.toLowerCase() == emoji.name.toLowerCase()){
                    var animated = ''
                    if(emoji.animated){
                        animated = 'a'
                    }
                    message.channel.createMessage('<'+ animated +':'+ emoji.name +':'+ emoji.id +'>')
                    return
                }
            })
        })
    }
}

module.exports = EmojiSender
