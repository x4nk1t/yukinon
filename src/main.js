const Eris = require('eris')

const client = new Eris('NjIwMjE0MTQ2MTUxMDg4MTM5.XvIxvQ.8-IcdV1cXH55bbVXe0SgTy2_DL8')

const Bot = require("./Bot.js");

client.on('ready', () => {
    const bot = new Bot(client)
    bot.start()
})

process.once('SIGINT', () => {
    try {
        client.disconnect();
    } catch (error) {
        console.log(error);
    }
    process.exit(0);
});

client.connect()