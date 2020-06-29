const discord = require('discord.js');
const EmbedBuilder = require('../utils/EmbedBuilder.js');
const Command = require('./Command.js');
const Image = require('../network/Images.js');

class ImagesCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, "images", "Shows the images.", "<help|(endpoint)>");
        
        this.image = new Image(this.server)
        this.endpoints = require('../utils/data/endpoints.json')
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
                
                message.channel.stopTyping()
                message.channel.send(new EmbedBuilder().build()
                    .setTitle('Images Help')
                    .setDescription('**Usage:** '+ this.usage + '\n' + description)
                    .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
                    .setTimestamp()
                );
                return;
            }
            if(this.sfw.includes(endpoint)){
                this.image.getImage(this.endpoints[endpoint], (image) => {
                    if(image == null){
                        message.channel.stopTyping()
                        message.channel.send(new discord.MessageEmbed()
                            .setTitle('Error')
                            .setColor('#FF0000')
                            .setDescription('Something went wrong while retrieving image.'));
                    } else {
                        message.channel.stopTyping()
                        message.channel.send(new EmbedBuilder().build()
                            .setTitle(endpoint)
                            .setImage(image)
                            .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
                            .setTimestamp());
                    }
                })  
            }else if(this.nsfw.includes(endpoint)){
                if(message.channel.nsfw){
                    const image = this.image.getImage(this.endpoints[endpoint], (image) => {
                        message.channel.stopTyping()
                        if(image == null){
                            message.channel.send(new discord.MessageEmbed()
                                .setTitle('Error')
                                .setColor('#FF0000')
                                .setDescription('Something went wrong while retrieving image.'));
                        } else {
                            message.channel.stopTyping()
                            message.channel.send(new EmbedBuilder().build()
                                .setTitle(endpoint)
                                .setImage(image)
                                .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
                                .setTimestamp());
                        }
                    })
                } else {
                    message.channel.stopTyping()
                    message.channel.send(new discord.MessageEmbed()
                        .setColor('#FF0000')
                        .setDescription('This is not **NSFW** enabled channel.'));
                }
            } else {
                message.channel.stopTyping()
                message.channel.send(new discord.MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('**'+ endpoint +'** doesn\'t exist.'));
            }
        } else {
            message.channel.send(new discord.MessageEmbed()
                .setColor('#FF0000')
                .setDescription('**Usage:** '+ this.usage));
        }
    }
}

module.exports = ImagesCommand;