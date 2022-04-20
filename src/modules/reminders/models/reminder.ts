import { Schema, model } from 'mongoose';

const reminder = new Schema({
    user_id: { type: String, required: true},
    reminder: {type: String, required: true},
    time: {type: String, required: true},
    channel_id: {type: String, required: true}
});

export default model('reminder', reminder, 'reminders')
