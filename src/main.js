const discord = require("discord.js")
const client = new discord.Client()

const BotServer = require("./BotServer.js");

client.on('ready', () => {
    const server = new BotServer(client)
    server.start()
})

client.login('NjIwMjE0MTQ2MTUxMDg4MTM5.XvIxvQ.8-IcdV1cXH55bbVXe0SgTy2_DL8')