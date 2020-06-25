const discord = require("discord.js")
const client = new discord.Client()

const AnimeScarper = require('./network/AnimeScarper.js');
const CommandLoader = require('./commands/CommandLoader.js');
const RandomActivity = require('./utils/RandomActivity.js');

const commandLoader = new CommandLoader(client)
const animeScarper = new AnimeScarper(client)
const randomActivity = new RandomActivity(client)

client.on('ready', () => {
    animeScarper.grabLastMessage()
    randomActivity.run()  
    
    console.log('[INFO] Bot started...')
})

client.on('message', async message => {
    if(message.author.bot) return;
    
    if(message.content.startsWith(commandLoader.prefix)){
        commandLoader.onCommand(message)
    }
})

client.login('NjIwMjE0MTQ2MTUxMDg4MTM5.XvIxvQ.8-IcdV1cXH55bbVXe0SgTy2_DL8')