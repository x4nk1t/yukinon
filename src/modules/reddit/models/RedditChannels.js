const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const reddit = new Schema({
    channel_id: {type: String, required: true},
    subreddits: {type: Array, required: true},
});

module.exports = mongoose.model('reddit', reddit, 'reddit')
