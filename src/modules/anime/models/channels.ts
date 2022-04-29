import {Schema, model} from 'mongoose';

const animechannels = new Schema({
    channel_id: {type: Number, required: true},
    last_updated: {type: Number, required: true}
})

export default model('animechannels', animechannels, 'animechannels');
