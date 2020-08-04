import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema, model } = mongoose;

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

export default model('User', userSchema)