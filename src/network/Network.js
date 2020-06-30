class Network {
    constructor(bot, baseUrl){
        this.bot = bot;
        this.baseUrl = baseUrl;
        this.client = bot.client;
    }
}

module.exports = Network