import { Schema, model } from 'mongoose';

const saucedm: Schema = new Schema({
    user_id: { type: Number, required: true},
    highlow: {type: String, required: true},
    sauce: { type: String, required: true},
    amount: {type: Number, required: true}
});

export default model('saucedm', saucedm, 'saucedm')