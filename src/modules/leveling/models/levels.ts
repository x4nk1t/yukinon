import { Schema, model } from "mongoose";

const LevelSchema = new Schema({
  userID: { type: String },
  guildID: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: new Date() }
});

export default model('levels', LevelSchema, 'levels');