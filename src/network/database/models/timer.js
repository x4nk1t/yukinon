const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const timer = new Schema({
    user_id: { type: Number, required: true},
    type: {type: String, required: true},
    time: {type: Number, required: true},
    channel_id: {type: Number, required: true}
});

module.exports = mongoose.model('timer', timer, 'rpg')