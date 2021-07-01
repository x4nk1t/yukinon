const Client = require("./src/Client.js");
const client = new Client({partials: ['GUILD_MEMBER']})

client.login(process.env.BOT_TOKEN)
