const axios = require('axios')

class RedditGrabber {
    constructor(client){
        this.client = client;
        this.redditManager = client.redditManager;
        this.lastPostId = '';

        this.run()
    }

    run(){
        axios.get('https://www.reddit.com/r/all/new/.json?limit=50').then(async response => {
            const posts = await this.getPosts(response).catch(console.error);
            
            this.redditManager.sendPosts(posts)
            
            setTimeout(() => {
               this.run()
            }, 4000);
       })
    }

    getPosts(response){
        return new Promise((resolve, reject) => {
            const data = response.data;
            const childrens = data.data.children;
            const posts = [];

            childrens.some(children => {
                const content = children.data;
                const id = content.id;
                const title = content.title;
                const subreddit = content.subreddit.toLowerCase();
                const url = content.url;
                const permalink = 'https://reddit.com'+ content.permalink;

                if(id == this.lastPostId){
                    return
                }

                const post = {
                    id: id,
                    title: title,
                    subreddit: subreddit,
                    url: url,
                    permalink: permalink
                }

                posts.push(post)
            });
            
            this.lastPostId = childrens[0].data.id;
            resolve(posts)
        })
    }
}

module.exports = RedditGrabber