class PingCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
    }
    
    async onCommand(message, ...commandArgs){
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }
}

module.exports = PingCommand