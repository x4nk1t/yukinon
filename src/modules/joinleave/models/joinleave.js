const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const joinleave = new Schema({
    guild_id: { type: Number, required: true},
    channel_id: {type: Number, required: true}
});

module.exports = mongoose.model('joinleave', joinleave, 'joinleave')
