const discord = require("discord.js")
const client = new discord.Client()

const Bot = require("./Bot.js");

client.on('ready', () => {
    const bot = new Bot(client)
    bot.start()
})

client.login('NjIwMjE0MTQ2MTUxMDg4MTM5.XvIxvQ.8-IcdV1cXH55bbVXe0SgTy2_DL8')