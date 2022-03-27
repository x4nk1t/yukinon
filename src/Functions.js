const emojis = ['⏪', '◀️', '▶️' ,'⏩']

module.exports = {
    createReactionCollector: (message, firstPage, lastPage, callback) => {
        var currentPage = 0;
        emojis.forEach(emoji => { firstPage.react(emoji) })
        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot;
        
        const reactionCollector = firstPage.createReactionCollector({filter, time: 60000 })
        reactionCollector.on('collect', (reaction, user) => {
            if(user.id != message.author.id) return
            reaction.users.remove(user)

            switch(reaction.emoji.name){
                case emojis[0]:
                    currentPage = 0;
                break;
                case emojis[1]:
                    currentPage = (currentPage == 0) ? 0 : currentPage - 1;
                break;

                case emojis[2]:
                    currentPage = (currentPage == lastPage) ? lastPage : currentPage + 1;
                break;

                case emojis[3]:
                    currentPage = lastPage;
                break;
            }
            
            callback(currentPage)
        })
    }
}