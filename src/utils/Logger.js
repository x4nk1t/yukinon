class Logger {
    constructor(client){
        this.client = client;
    }
    
    info(message){
        console.log('['+ this.timestamp() +'] [INFO] ' + message);
    }
    
    error(message){
        console.log('['+ this.timestamp() +'] [ERROR] ' + message);
    }
    
    timestamp(){
        const date = new Date()
        const timeStamp = ('0'+ date.getHours()).slice(-2) +':'+ ('0'+ date.getMinutes()).slice(-2) +':'+ ('0'+ date.getSeconds()).slice(-2)
        
        return timeStamp
    }
}

module.exports = Logger