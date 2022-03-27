const { Intents } = require('discord.js');
const Client = require("./src/Client.js");
const client = new Client({intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']})

client.login(process.env.BOT_TOKEN)
