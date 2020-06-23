const discord = require("discord.js")
const client = new discord.Client()

client.on('ready', () => {
    client.user.setActivity("with x4nk1t")
    console.log('[INFO] Bot started...')
})

client.login('NjIwMjE0MTQ2MTUxMDg4MTM5.XvIxvQ.8-IcdV1cXH55bbVXe0SgTy2_DL8')