import { Schema, model } from 'mongoose';

const timer = new Schema({
    user_id: { type: Number, required: true},
    type: {type: String, required: true},
    time: {type: Number, required: true},
    channel_id: {type: Number, required: true},
    username: {type: String, required: true},
    mention: {type: String, required: true}
});

export default model('timer', timer, 'rpg')
