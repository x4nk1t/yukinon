class Network {
    constructor(server, baseUrl){
        this.server = server;
        this.baseUrl = baseUrl;
        this.client = server.client;
    }
}

module.exports = Network