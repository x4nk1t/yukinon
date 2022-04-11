const Client = require("./src/Client.js");
const client = new Client({intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MEMBERS']})

client.login(process.env.BOT_TOKEN)
