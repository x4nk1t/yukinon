class AddReactions {
    constructor(client){
        this.client = client;

        this.registerEvent()
    }

    registerEvent(){
        this.client.on('message', message => {
            if(message.author.id != '432610292342587392') return
            if(message.embeds.length <= 0) return

            setTimeout(() => {
                const embed = message.embeds[0];
                const description = embed.description.toLowerCase();
                if(!description.includes('<:kakera:469835869059153940>') || description.includes('like') || embed.image == null || message.reactions.cache.size > 0) return

                const now = new Date()
                const startDate = new Date(new Date().setUTCHours(12,0,0,0))
                const endDate = new Date(new Date().setUTCHours(31,0,0,0))

                if(now.getUTCHours() < endDate.getUTCHours()){
                    startDate.setUTCDate(now.getUTCDate() - 1)
                }

                const startTime = startDate.getTime()
                const endTime = endDate.getTime()
                
                if((now > startTime) && (now < endTime)){
                    message.react('❤️')
                }
            }, 500)
        })
    }
}

module.exports = AddReactions