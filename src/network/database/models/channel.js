const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const channel = new Schema({
    channel_id: { type: Number, required: true},
    tracking: [{type: String}]
});

module.exports = mongoose.model('channel', channel, 'release_channels')