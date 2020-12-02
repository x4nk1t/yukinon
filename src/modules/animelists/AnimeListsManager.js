const LinkCommand = require('./cmds/link-profile.js')
const ProfileCommand = require('./cmds/user-profile.js')
const Profile = require('./models/profile.js')

class AnimeListsManager {
    constructor(client){
        this.client = client;
        this.cmdManager = client.commandManager;
        
        this.profiles = new Discord.Collection()
        
        this.loadCommands()
    }
    
    run(){
        
    }
    
    loadCommands(){
        this.cmdManager.loadCommand(new LinkCommand(this.cmdManager))
        this.cmdManager.loadCommand(new ProfileCommand(this.cmdManager))
    }
    
    /*
    * AL Api
    */
    
    getAnilistProfile(username){
        return new Promise((resolve, reject) => {
            const query = `query($username: String){User(name: $username){id,name,siteUrl,donatorTier,avatar {large},statistics {anime {count,meanScore,minutesWatched,episodesWatched},manga{count,meanScore,chaptersRead,volumesRead}}}}`;
            
            var options = this.optionBuilder({query: query, variables: {username: username}})
            this.sendRequest(options, (err, data) => {
                if(err){
                    reject(null)
                } else {
                    resolve(data)
                }
            })
        })
    }
    
    sendRequest(options, callback = () => {}){
        fetch(this.apiUrl, options).then(response => response.json()).then(data => {
            callback(false, data)
        }).catch(err => {
            console.log(err)
            callback(true, err)
        })
    }
    
    optionBuilder(object, token = ""){
        var options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(object)
        }
        if(token != ""){
            options.headers.Authorization = 'Bearer '+ token;
        }
        
        return options;
    }
}

module.exports = AnimeListsManager
