import { mongoose } from '@typegoose/typegoose';

export const mongodbConfig: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
