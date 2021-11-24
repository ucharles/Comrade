import { Document } from 'mongoose';

export interface AuthDocument extends Document {
  readonly email: string;
  readonly username?: string;
  readonly password: string;
}
