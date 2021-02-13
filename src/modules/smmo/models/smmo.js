const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const profile = new Schema({
    user_id: { type: Number, required: true},
    ingame_id: {type: Number, required: true},
    send_daily: {type: Number, required: true}
});

module.exports = mongoose.model('profile', profile, 'smmo')
