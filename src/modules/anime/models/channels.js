const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const channels = new Schema({
    channel_id: {type: Number, required: true},
    tracking: {type: String, require: true},
    last_updated: {type: Number, required: true}
})

module.exports = mongoose.model('channels', channels, 'channels')
