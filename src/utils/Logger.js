class Logger {
    constructor(client){
        this.client = client;
    }
    
    info(message){
        console.log('['+ this.timestamp() +'] [INFO] ' + message);
    }
    
    error(message){
        console.log('['+ this.timestamp() +'] [INFO] ' + message);
    }
    
    timestamp(){
        const date = new Date()
        const timeStamp = date.getHours() +':'+ date.getMinutes() +':'+ ('0'+ date.getSeconds()).slice(-2)
        
        return timeStamp
    }
}

module.exports = Logger