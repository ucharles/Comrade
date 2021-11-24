import { isEmail } from 'class-validator';
import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
  id: String,
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'please enter a valid email'],
  },
  username: String,
  password: { type: String, required: [true, 'Please enter an password'] },
  signedDate: Date,
});

/*
// mongoose hook
// after save
AuthSchema.post('save', (doc, next) => {
  console.log('new user was created & saved', doc);
  next();
});

// before save
AuthSchema.pre('save', (next) => {
  console.log('user about to be created & saved', this);
  next();
});
*/
