class Logger {
    constructor(bot){
        this.bot = bot;
    }
    
    info(message){
        console.log('[INFO] '+ message);
    }
    
    error(message){
        console.log('[ERROR] '+ message);
    }
}

module.exports = Logger