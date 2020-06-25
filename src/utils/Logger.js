class Logger {
    constructor(server){
        this.server = server;
    }
    
    info(message){
        console.log('[INFO] '+ message);
    }
    
    error(message){
        console.log('[ERROR] '+ message);
    }
}

module.exports = Logger