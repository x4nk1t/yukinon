class RandomActivity {
    constructor(client){
        this.client = client;
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
                status: client.commandLoader.prefix +'help',
                type: 2
            },
            {
                status: 'Anime',
                type: 3
            },
            {
                status: 'to x4nk1t',
                type: 2
            }
        ];
    }
    
    run(){
        this.show();
        setInterval(() => this.show(), 1000 * this.changeInSeconds)
    }
    
    show(){
        const random = this.statuses[Math.floor(Math.random() * this.statuses.length)];
        
        this.client.user.setActivity(random.status, {type: random.type})
    }
}

module.exports = RandomActivity