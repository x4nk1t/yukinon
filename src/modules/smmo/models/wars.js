const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const wars = new Schema({
    user_id: { type: Number, required: true},
    guilds_id: {type: Array, required: true}
});

module.exports = mongoose.model('wars', wars, 'wars')
