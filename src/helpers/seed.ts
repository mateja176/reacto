import Joi from 'joi';
import mongoose from 'mongoose';
import { Role } from '../classes/User/User';
import env from '../services/env';
import hashPassword from '../services/hashPassword';
import { CompanyModel, UserModel } from '../services/models';
import { passwordSchema } from '../utils/validate';

export interface SeedInput {
  name: string;
  email: string;
  password: string;
}

const seedInputSchema = Joi.object<SeedInput>({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: passwordSchema,
}).required();

const seed = async (input: SeedInput) => {
  const { name, email, password } = await seedInputSchema.validateAsync(input);

  await mongoose.connect(env.mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const userId = mongoose.Types.ObjectId();

  const reacto = await CompanyModel.create({
    _id: mongoose.Types.ObjectId(),
    name: 'Reacto',
    owner: userId,
    pendingUsers: [],
    users: [],
    questionnaireConfigurations: [],
    questionnaires: [],
  });

  await UserModel.create({
    _id: userId,
    name,
    email,
    passwordHash: await hashPassword(password),
    role: Role.admin,
    questionnaires: [],
    company: reacto._id,
  });

  await mongoose.connection.close();
};

export default seed;
