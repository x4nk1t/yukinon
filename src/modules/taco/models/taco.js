const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const taco = new Schema({
    user_id: { type: Number, required: true},
    type: {type: String, required: true},
    time: {type: Number, required: true},
    channel_id: {type: Number, required: true},
    username: {type: String, required: true},
    mention: {type: String, required: true}
});

module.exports = mongoose.model('taco', taco, 'taco')
