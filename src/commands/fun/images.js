const Command = require('../Command.js');
const ImagesGrabber = require('../../utils/ImagesGrabber.js');

class Images extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "images",
            description: "Shows the images.",
            usage: "<help|(endpoint)>"
        });
        
        this.image = new ImagesGrabber(this.client)
        this.endpoints = require('../../utils/data/endpoints.json')
        this.nsfw = ['randomHentaiGif','pussy','nekoGif','neko','lesbian','kuni','cumsluts','classic','boobs','bJ','anal','avatar','yuri','trap','tits','girlSoloGif','girlSolo','pussyWankGif','pussyArt','kemonomimi','kitsune','keta','holo','holoEro','hentai','futanari','femdom','feetGif','eroFeet','feet','ero','eroKitsune','eroKemonomimi','eroNeko','eroYuri','cumArts','blowJob','spank','gasm'];
        this.sfw = ['smug','baka','tickle','slap','poke','pat','neko','nekoGif','meow','lizard','kiss','hug','foxGirl','feed','cuddle','kemonomimi','holo','woof','wallpaper','goose','gecg','avatar','waifu'];
    }
    
    execute(message, commandArgs){        
        const endpoint = commandArgs[0];
        
        message.channel.startTyping()
        if(endpoint){
            if(endpoint == "help"){
                var description = '**SFW**\n';
                
                for(var i = 0; i < this.sfw.length; i++){
                    description += this.sfw[i] +', ';
                }
                
                description += "\n**NSFW**\n";
                
                for(var i = 0; i < this.nsfw.length; i++){
                    description += this.nsfw[i] +', ';
                }
                
                message.channel.send({
                    embed: {
                        title: 'Images',
                        color: 'RANDOM',
                        description: '**Usage:** '+ this.usage + '\n' + description,
                        footer: {
                            text: 'Requested by '+ message.author.username,
                            icon_url: message.author.displayAvatarURL()
                        }
                    }
                });
                message.channel.stopTyping()
                return;
            }
            if(this.sfw.includes(endpoint)){
                this.image.getImage(this.endpoints[endpoint], (image) => {
                    if(image == null){
                        message.channel.send({
                            embed: {
                                title: 'ERROR',
                                color: '#FF0000',
                                description: 'Something went wrong while retrieving image.'
                            }
                        })
                    } else {
                        message.channel.send({
                            embed: {
                                title: endpoint,
                                color: 'RANDOM',
                                image: {
                                    url: image
                                },
                                footer: {
                                    text: 'Requested by '+ message.author.username,
                                    icon_url: message.author.displayAvatarURL()
                                }
                            }
                        })
                    }
                })  
            }else if(this.nsfw.includes(endpoint)){
                if(message.channel.nsfw){
                    const image = this.image.getImage(this.endpoints[endpoint], (image) => {
                        if(image == null){
                            message.channel.send({
                                embed: {
                                    title: 'ERROR',
                                    color: '#FF0000',
                                    description: 'Something went wrong while retrieving image.'
                                }
                            })
                        } else {
                            message.channel.send({
                                embed: {
                                    title: endpoint,
                                    color: 'RANDOM',
                                    image: {
                                        url: image
                                    },
                                    footer: {
                                        text: 'Requested by '+ message.author.username,
                                        icon_url: message.author.displayAvatarURL()
                                    }
                                }
                            })
                        }
                    })
                } else {
                    message.channel.send({
                        embed: {
                            color: '#FF0000',
                            description: 'This is not **NSFW** enabled channel.'
                        }
                    })
                }
            } else {
                message.channel.send({
                    embed: {
                        color: '#FF0000',
                        description: '**'+ endpoint +'** doesn\'t exist.'
                    }
                })
            }
        } else {
            message.channel.send({
                embed: {
                    color: '#FF0000',
                    description: '**Usage:** '+ this.usage
                }
            })
        }
        message.channel.stopTyping()
    }
}

module.exports = Images;