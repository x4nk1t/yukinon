class RandomActivity {
    constructor(server){
        this.server = server;
        this.client = server.client;
        this.changeInSeconds = 37;
        
        this.activities = ['with Hikigaya-kun', 'with cat', 'the world:WATCHING', 'Oregairu:WATCHING', server.commandLoader.prefix +"help", 'Anime:WATCHING'];
    }
    
    run(){
        this.show();
        setInterval(() => this.show(), 1000 * this.changeInSeconds)
    }
    
    show(){
        const randomActivity = this.activities[Math.floor(Math.random() * this.activities.length)];
        var type = randomActivity.split(':')[1]
        var text = randomActivity.split(':')[0]
        if(type == null || type == ""){
            type = "PLAYING";
            text = randomActivity;
        }
        
        this.client.user.setActivity(text, {type: type})
    }
}

module.exports = RandomActivity