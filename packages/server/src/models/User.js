import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

userSchema.plugin(uniqueValidator);

module.exports = model('User', userSchema)