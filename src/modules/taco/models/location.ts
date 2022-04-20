import { Schema, model } from 'mongoose';

const location: Schema = new Schema({
    user_id: { type: Number, required: true},
    location: { type: String, required: true}
});

export default model('locations', location, 'locations')