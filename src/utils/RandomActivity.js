class RandomActivity {
    constructor(bot){
        this.bot = bot;
        this.client = bot.client;
        this.changeInSeconds = 37;
        
        this.statuses = [
            {
                status: 'with Hikigaya-kun',
                type: 0
            },
            {
                status: 'with cat',
                type: 0
            },
            {
                status: 'the world',
                type: 3
            },
            {
                status: 'Oregairu',
                type: 3
            },
            {
                status: bot.commandLoader.prefix +'help',
                type: 2
            },
            {
                status: 'Anime',
                type: 3
            }
        ];
    }
    
    run(){
        this.show();
        setInterval(() => this.show(), 1000 * this.changeInSeconds)
    }
    
    show(){
        const random = this.statuses[Math.floor(Math.random() * this.statuses.length)];
        
        this.client.editStatus({name: random.status, type: random.type})
    }
}

module.exports = RandomActivity