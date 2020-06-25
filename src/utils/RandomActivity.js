const discord = require('discord.js')

class RandomActivity {
    constructor(client){
        this.client = client;
        this.changeInSeconds = 37;
        
        this.activities = ['with Lelouch', 'with cat', 'the world:WATCHING', 'YouTube:WATCHING', 'Code Geass:WATCHING', 'One Piece:WATCHING', 'Anime:WATCHING'];
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