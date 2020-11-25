const Command = require('../Command.js')
const fetch = require('node-fetch')

class UserProfile extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'user-profile',
            description: 'Check you MAL/AniList profile.',
            usage: '<username> [mal|al]',
            aliases: ['up']
        })
        
        this.apiUrl = 'https://graphql.anilist.co';
    }

    async execute(message, commandArgs){
        const username = commandArgs[0];
        if(username){
            var type = commandArgs[1];
            
            if(!type) type = 'al';
            
            if(type == 'mal'){
                message.channel.send('MAL is still WIP!')
            } else if(type == 'al'){
                const details = await this.getAnilistProfile(username)
                
                if(details.errors && details.errors[0].status == 404) {
                    message.channel.send('User not found. Make sure your **username** is correct!')
                    return
                }
                
                const p = details.data.User;
                const as = p.statistics.anime;
                const ms = p.statistics.manga;
                message.channel.send({
                    embed: {
                        title: p.name,
                        url: p.siteUrl,
                        color: 'BLUE',
                        thumbnail: {url: p.avatar.large},
                        fields: [
                            { name: 'ID', value: p.id, inline: true },
                            { name: 'Username', value: p.name, inline: true },
                            { name: 'Donator', value: p.donatorTier == 0 ? 'No' : 'Yes'},
                            { name: '\u200b', value: '**Anime Stats**' },
                            { name: 'Count',value: as.count, inline: true },
                            { name: 'Mean Score', value: as.meanScore.toString(), inline: true },
                            { name: 'Episodes', value: as.episodesWatched, inline: true },
                            { name: 'Minutes', value: as.minutesWatched,inline: true },
                            { name: '\u200b', value: '**Manga Stats**' },
                            { name: 'Count', value: ms.count, inline: true},
                            { name: 'Mean Score', value: ms.meanScore.toString(), inline: true },
                            { name: 'Chapters', value: ms.chaptersRead, inline: true},
                            { name: 'Volumes', value: ms.volumesRead, inline: true}
                        ],
                        footer: {
                            text: 'Requested by '+ message.author.username,
                            icon_url: message.author.displayAvatarURL()
                        }
                    }
                })
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }
    
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

module.exports = UserProfile;
