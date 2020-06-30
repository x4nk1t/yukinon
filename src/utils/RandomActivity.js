class RandomActivity {
    constructor(bot){
        this.bot = bot;
        this.client = bot.client;
        this.changeInSeconds = 37;
        
        this.activities = ['with Hikigaya-kun:PLAYING', 'with cat:PLAYING', 'the world:WATCHING', 'Oregairu:WATCHING', bot.commandLoader.prefix +"help:LISTENING", 'Anime:WATCHING'];
    }
    
    run(){
        this.show();
        setInterval(() => this.show(), 1000 * this.changeInSeconds)
    }
    
    show(){
        const randomActivity = this.activities[Math.floor(Math.random() * this.activities.length)];
        var type = randomActivity.split(':')[1]
        var text = randomActivity.split(':')[0]
        
        this.client.user.setActivity(text, {type: type})
    }
}

module.exports = RandomActivity