const mongoose = require('mongoose')

var Schema = mongoose.Schema

var release = new Schema({
    name: {type: String},
    episode: {type: Number}
})

module.exports = mongoose.model('release', release, 'releases')