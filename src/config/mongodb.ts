import mongoose from 'mongoose';

export const mongodbConfig: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
