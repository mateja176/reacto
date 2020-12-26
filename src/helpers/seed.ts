import { mongoose } from '@typegoose/typegoose';
import { CommanderStatic } from 'commander';
import Joi from 'joi';
import { mongodbConfig } from '../config/mongodb';
import env from '../services/env';
import { createModels } from '../services/models';
import { passwordSchema } from '../utils/validate';
import { createCompanyAndUser } from './db';

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

const seed = async (input: SeedInput) => {
  const validatedInput: SeedInput = await seedInputSchema.validateAsync(input);

  const connection = await mongoose.createConnection(
    env.mongodbURI,
    mongodbConfig,
  );

  const models = createModels(connection);
  await createCompanyAndUser(models)(validatedInput);

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
