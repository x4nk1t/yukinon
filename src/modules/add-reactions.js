class AddReactions {
    constructor(client){
        this.client = client;

        this.registerEvent()
    }

    registerEvent(){
        this.client.on('message', message => {
            if(message.author.id != '432610292342587392') return
            if(message.embeds.length <= 0) return
            if(!message.embeds[0].description.includes('<:kakera:469835869059153940>')) return

            const now = new Date().getTime()
            const startTime = new Date(new Date().setUTCHours(14,0,0,0)).getTime()
            const endTime = new Date(new Date().setUTCHours(31,0,0,0)).getTime()

            if((now > startTime) && (now < endTime)){
                message.react('❤️')
            }
        })
    }
}

module.exports = AddReactions