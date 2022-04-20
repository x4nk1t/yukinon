import {Schema, model} from 'mongoose';

const settings: Schema = new Schema({
    name: {type: String, required: true},
    value: {type: String, required: true}
})

export default model('settings', settings, 'settings');