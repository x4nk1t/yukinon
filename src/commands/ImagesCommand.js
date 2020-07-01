const Color = require('../utils/Color.js');
const Command = require('./Command.js');
const Image = require('../network/Images.js');

class ImagesCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, "images", "Shows the images.", "<help|(endpoint)>");
        
        this.image = new Image(this.bot)
        this.endpoints = require('../utils/data/endpoints.json')
        this.nsfw = ['randomHentaiGif','pussy','nekoGif','neko','lesbian','kuni','cumsluts','classic','boobs','bJ','anal','avatar','yuri','trap','tits','girlSoloGif','girlSolo','pussyWankGif','pussyArt','kemonomimi','kitsune','keta','holo','holoEro','hentai','futanari','femdom','feetGif','eroFeet','feet','ero','eroKitsune','eroKemonomimi','eroNeko','eroYuri','cumArts','blowJob','spank','gasm'];
        this.sfw = ['smug','baka','tickle','slap','poke','pat','neko','nekoGif','meow','lizard','kiss','hug','foxGirl','feed','cuddle','kemonomimi','holo','woof','wallpaper','goose','gecg','avatar','waifu'];
    }
    
    execute(message, commandArgs){        
        const endpoint = commandArgs[0];
        
        message.channel.sendTyping()
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
                
                message.channel.createMessage({
                    embed: {
                        title: 'Images',
                        color: Color.random(),
                        description: '**Usage:** '+ this.usage + '\n' + description,
                        footer: {
                            text: 'Requested by '+ message.author.username,
                            icon_url: message.author.avatarURL
                        }
                    }
                });
                return;
            }
            if(this.sfw.includes(endpoint)){
                this.image.getImage(this.endpoints[endpoint], (image) => {
                    if(image == null){
                        message.channel.createMessage({
                            embed: {
                                title: 'ERROR',
                                color: Color.color('#FF0000'),
                                description: 'Something went wrong while retrieving image.'
                            }
                        })
                    } else {
                        message.channel.createMessage({
                            embed: {
                                title: endpoint,
                                image: {
                                    url: image
                                },
                                footer: {
                                    text: 'Requested by '+ message.author.username,
                                    icon_url: message.author.avatarURL
                                }
                            }
                        })
                    }
                })  
            }else if(this.nsfw.includes(endpoint)){
                if(message.channel.nsfw){
                    const image = this.image.getImage(this.endpoints[endpoint], (image) => {
                        if(image == null){
                            message.channel.createMessage({
                                embed: {
                                    title: 'ERROR',
                                    color: Color.color('#FF0000'),
                                    description: 'Something went wrong while retrieving image.'
                                }
                            })
                        } else {
                            message.channel.createMessage({
                                embed: {
                                    title: endpoint,
                                    image: {
                                        url: image
                                    },
                                    footer: {
                                        text: 'Requested by '+ message.author.username,
                                        icon_url: message.author.avatarURL
                                    }
                                }
                            })
                        }
                    })
                } else {
                    message.channel.createMessage({
                        embed: {
                            color: Color.color('#FF0000'),
                            description: 'This is not **NSFW** enabled channel.'
                        }
                    })
                }
            } else {
                message.channel.createMessage({
                    embed: {
                        color: Color.color('#FF0000'),
                        description: '**'+ endpoint +'** doesn\'t exist.'
                    }
                })
            }
        } else {
            message.channel.createMessage({
                embed: {
                    color: Color.color('#FF0000'),
                    description: '**Usage:** '+ this.usage
                }
            })
        }
    }
}

module.exports = ImagesCommand;