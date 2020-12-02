const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const profile = new Schema({
    discord_id: {type: String, required: true},
    username: {type: String, required: true},
    type: {type: String, required: true}
})

module.exports = mongoose.model('profile', profile, 'AL_Data')
