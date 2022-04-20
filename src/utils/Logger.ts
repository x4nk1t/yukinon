import Client from "../Client";

class Logger {
    client: Client;

    constructor(client: Client){
        this.client = client;
    }
    
    info(message: string){
        console.log('['+ this.timestamp() +'] [INFO] ' + message);
    }
    
    error(message: string){
        console.log('['+ this.timestamp() +'] [ERROR] ' + message);
    }
    
    timestamp(){
        const date = new Date()
        const timeStamp = ('0'+ date.getHours()).slice(-2) +':'+ ('0'+ date.getMinutes()).slice(-2) +':'+ ('0'+ date.getSeconds()).slice(-2)
        
        return timeStamp
    }
}

export default Logger;