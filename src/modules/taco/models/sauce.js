const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const saucechannels = new Schema({
    channel_id: {type: Number, required: true},
    last_udpated: {type: Number, required: true}
});

module.exports = mongoose.model('saucechannels', saucechannels, 'saucechannels')