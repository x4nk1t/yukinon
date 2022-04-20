import { Schema, model } from 'mongoose';

const saucechannels: Schema = new Schema({
    channel_id: {type: Number, required: true},
    last_udpated: {type: Number, required: true}
});

export default model('saucechannels', saucechannels, 'saucechannels')