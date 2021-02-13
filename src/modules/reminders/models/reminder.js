const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const reminder = new Schema({
    user_id: { type: Number, required: true},
    reminder: {type: String, required: true},
    time: {type: String, required: true},
    channel: {type: String, required: true}
});

module.exports = mongoose.model('reminder', reminder, 'reminders')