import Client from "./src/Client";
const client = new Client({intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MEMBERS']});

client.login(process.env.BOT_TOKEN);
