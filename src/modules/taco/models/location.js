const mongoose = require('mongoose')

var Schema = mongoose.Schema;

const location = new Schema({
    user_id: { type: Number, required: true},
    location: { type: String, required: true}
});

module.exports = mongoose.model('locations', location, 'locations')