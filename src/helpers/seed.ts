import { CommanderStatic } from 'commander';
import Joi from 'joi';
import mongoose from 'mongoose';
import { Role } from '../classes/User/User';
import { mongodbConfig } from '../config/mongodb';
import env from '../services/env';
import hashPassword from '../services/hashPassword';
import { Models } from '../services/models';
import { passwordSchema } from '../utils/validate';

export interface SeedInput {
  name: string;
  email: string;
  password: string;
}

export const seedInputSchema = Joi.object<SeedInput>({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: passwordSchema,
}).required();

export const createCompanyAndUser = (models: Models) => async ({
  name,
  email,
  password,
}: SeedInput) => {
  const userId = mongoose.Types.ObjectId();

  const reacto = await models.Company.create({
    name: 'Reacto',
    owner: userId,
    pendingUsers: [],
    users: [],
    questionnaireConfigurations: [],
    questionnaires: [],
  });

  const userDoc = await models.User.create({
    _id: userId,
    name,
    email,
    passwordHash: await hashPassword(password),
    role: Role.admin,
    questionnaires: [],
    company: reacto._id,
  });

  return { userDoc, companyDoc: reacto };
};

const seed = async (input: SeedInput) => {
  const validatedInput = await seedInputSchema.validateAsync(input);

  const connection = await mongoose.createConnection(
    env.mongodbURI,
    mongodbConfig,
  );

  await createCompanyAndUser(validatedInput);

  await connection.close();
};

export const getSeedInput = (commander: CommanderStatic): SeedInput => {
  const { email, password, userName } = commander
    .option('-n, --user-name <name>', "User's name")
    .option('-e, --email <email>', "User's email")
    .option('-p, --password <password>', "User's password")
    .parse(process.argv);
  return {
    email,
    password,
    name: userName,
  };
};

export default seed;
