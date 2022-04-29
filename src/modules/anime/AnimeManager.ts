import { MessageEmbedOptions, Snowflake, TextChannel } from "discord.js";
import Client from "../../Client";
import CommandManager from "../../CommandManager";

import AnimeReleaseCMD from './cmds/anime-release';
import WhatAnime from './cmds/what-anime';
import AnimeChannel from './cmds/anime-channel';

import Channels from './models/channels';
import fetch from 'node-fetch';

interface EpisodesInterface {
    id: number;
    title: string;
    url: string;
    episode: number;
    cover: string;
    airingAt: number;
}

interface AnimeInterface{
    channel_id: Snowflake;
    last_updated?: number;
}

class AnimeManager {
    client: Client;
    apiUrl: string;
    episodes: EpisodesInterface[];
    animeChannels: AnimeInterface[];
    commandManager: CommandManager;

    constructor(client: Client){
        this.client = client;
        
        this.apiUrl = 'https://graphql.anilist.co';
        this.episodes = [];
        this.animeChannels = [];
        
        this.commandManager = client.commandManager;
        
        this.loadCommands()
        this.run()
    }
    
    async run(){
        await this.getAnimeChannels().then((data: any) => { this.animeChannels = data; }).catch(console.log)
        await this.getNewReleases().then((data: any) => { this.episodes = data; }).catch(console.log)
        
        if(this.episodes.length) {
            this.setTimeouts()
        } else {
            setTimeout(() => this.run(), 300000) //5min
        }
    }
    
    loadCommands(){
        this.commandManager.loadCommand(new AnimeReleaseCMD(this.commandManager))
        this.commandManager.loadCommand(new WhatAnime(this.commandManager))
        this.commandManager.loadCommand(new AnimeChannel(this.commandManager))
    }
    
    setTimeouts(){
        this.episodes.forEach((episode: EpisodesInterface) => {
            var now = new Date().getTime()
            var id = episode.id;
            var title = episode.title;
            var url = episode.url;
            var episode_num = episode.episode;
            var cover = episode.cover;
            var airingAt = episode.airingAt;
            var difference = airingAt - now;

            if(difference > 0){
                setTimeout(() => {
                    var embed: MessageEmbedOptions = {
                        title: 'New episode got released!',
                        color: 'BLUE',
                        thumbnail: {url: cover},
                        fields: [
                            {name: 'Title', value: title, inline: true},
                            {name: 'Episode', value: episode_num.toString(), inline: true},
                            {name: 'AniList', value: url}
                        ],
                        timestamp: new Date(),
                    }
                    
                    this.animeChannels.forEach(ch => {
                        var channel = this.client.channels.cache.get(ch.channel_id);
                    
                        if(channel instanceof TextChannel)
                            channel.send({embeds: [embed]})
                    })
                    
                    this.episodes.splice(this.episodes.indexOf(episode), 1)
                }, difference)
            }
        })
    }
    
    /*
    * Database API
    */
    
    getAnimeChannels(){
        return new Promise((resolve, reject) => {
            const cursor = Channels.collection.find({});
            resolve(cursor.toArray());
        })
    }
    
    addAnimeChannel(channel_id: any){
        return new Promise((resolve, reject) => {
            Channels.collection.findOneAndUpdate({channel_id: channel_id}, {$set: {last_updated: new Date().getTime()}}, {upsert: true}, (err: any) => {
                if(err){
                    this.client.logger.error(err)
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }
    
    removeAnimeChannel(channel_id: any){
        return new Promise((resolve, reject) => {
            Channels.collection.findOneAndDelete({channel_id: channel_id}, (err: any, channels: any) => {
                if(err){
                    this.client.logger.error(err)
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }
    
    /*
    * Anilist API
    */
    
    getAnimeFromIDArray(idArray: number[]){
        return new Promise((resolve, reject) => {
            var query = `query($idArray: [Int]){Page{media(id_in: $idArray){title {userPreferred},id,idMal,countryOfOrigin}}}`;
            var variables = {idArray: idArray}
            var options = this.optionBuilder({query: query, variables: variables})
            this.sendRequest(options, (err: any, data: any) => {
                if(err){
                    reject(data)
                    return
                }
                const media = data.data.Page.media
                resolve(media)
            })
        })
    }
    
    getNewReleases(){
        return new Promise((resolve, reject) => {
            var query = `{Page{airingSchedules(notYetAired: true){media{id,title {userPreferred}, coverImage{large}, countryOfOrigin, siteUrl},episode,airingAt}}}`;
            var options = this.optionBuilder({query: query})
            this.sendRequest(options, (err: any, data: any) => {
                if(err){
                    reject(data)
                    return
                }
                const {airingSchedules} = data.data.Page;
                var array = []
                
                for(var i = 0; i < airingSchedules.length; i++){
                    const schedule = airingSchedules[i];
                    const media = schedule.media;
                    const id = media.id;
                    const title = media.title.userPreferred;
                    const url = media.siteUrl;
                    const cover = media.coverImage.large;
                    const countryOfOrigin = media.countryOfOrigin;
                    const episode = schedule.episode;
                    const airingAt = schedule.airingAt;
                    
                    if(countryOfOrigin == "JP"){
                        array.push({
                            id: id,
                            title: title,
                            episode: episode,
                            url: url,
                            cover: cover,
                            airingAt: (airingAt * 1000)
                        })
                    }
                }
                resolve(array)
            })
        })
    }
    
    sendRequest(options: { method: string; headers: { 'Content-Type': string; Accept: string }; body: string }, callback = (err: any, data: any) => {}){
        fetch(this.apiUrl, options).then((response: { json: () => any }) => response.json()).then((data: any) => {
            callback(false, data)
        }).catch((err: any) => {
            console.log(err)
            callback(true, err)
        })
    }
    
    optionBuilder(object: { query: string; variables?: { id?: any, idArray?: any } }){
        var options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(object)
        }
        
        return options;
    }
}

export default AnimeManager;
