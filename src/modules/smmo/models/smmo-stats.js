const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const stats = new Schema({
    ingame_id: {type: Number, required: true},
    level: {type: Number, required: true},
    steps: {type: Number, required: true},
    user_kills: {type: Number, required: true},
    npc_kills: {type: Number, required: true},
    quests_complete: {type: Number, required: true},
    datetime: {type: Number, required: true}
});

module.exports = mongoose.model('stats', stats, 'smmo_stats')
