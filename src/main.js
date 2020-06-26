const discord = require("discord.js")
const client = new discord.Client()

const BotServer = require("./BotServer.js");
const server = new BotServer(client)

client.on('ready', () => {
    server.start()
})

client.login('NjIwMjE0MTQ2MTUxMDg4MTM5.XvIxvQ.8-IcdV1cXH55bbVXe0SgTy2_DL8')