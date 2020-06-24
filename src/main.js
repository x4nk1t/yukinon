const discord = require("discord.js")
const client = new discord.Client()

const startTime = new Date().getTime();
const AnimeScarper = require('./AnimeScarper.js');

client.on('ready', () => {
    const animeScarper = new AnimeScarper(client)
    animeScarper.grabLastMessage()
   
    client.user.setActivity("with Lelouch")
    console.log('[INFO] Bot started...')
})

client.login('NjIwMjE0MTQ2MTUxMDg4MTM5.XvIxvQ.8-IcdV1cXH55bbVXe0SgTy2_DL8')