const discord = require("discord.js")
const client = new discord.Client()

const BotServer = require("./BotServer.js");
const server = new BotServer(client)

client.on('ready', () => {
    server.start()
})

client.on('message', async message => {
    if(message.author.bot) return;
    
    if(message.content.startsWith(server.commandLoader.prefix)){
        server.commandLoader.onCommand(message)
    }
})

client.login('NjIwMjE0MTQ2MTUxMDg4MTM5.XvIxvQ.8-IcdV1cXH55bbVXe0SgTy2_DL8')