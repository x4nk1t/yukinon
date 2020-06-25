const TextFormat = require('./TextFormat.js');

class Logger {
    constructor(server){
        this.server = server;
    }
    
    info(message){
        console.log(TextFormat.GREEN + '[INFO] '+ TextFormat.RESET + message);
    }
    
    error(message){
        console.log(TextFormat.RED + TextFormat.BRIGHT +'[ERROR] '+ message + TextFormat.RESET);
    }
}

module.exports = Logger