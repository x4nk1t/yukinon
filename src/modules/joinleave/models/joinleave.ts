import { Schema, model } from 'mongoose';

const joinleave = new Schema({
    guild_id: { type: Number, required: true},
    channel_id: {type: Number, required: true}
});

export default model('joinleave', joinleave, 'joinleave')
