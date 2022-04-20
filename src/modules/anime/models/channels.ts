import {Schema, model} from 'mongoose';

const channels = new Schema({
    channel_id: {type: Number, required: true},
    tracking: {type: [Number], require: true},
    last_updated: {type: Number, required: true}
})

export default model('channels', channels, 'channels');
