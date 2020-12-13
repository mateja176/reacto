import commander from 'commander';
import mongoose from 'mongoose';
import { Role } from '../src/classes/User/User';
import env from '../src/services/env';
import hashPassword from '../src/services/hashPassword';
import { CompanyModel, UserModel } from '../src/services/models';

const { userName, email, password } = commander
  .option('-n, --user-name <name>', "User's name")
  .option('-e, --email <email>', "User's email")
  .option('-p, --password <password>', "User's password")
  .parse(process.argv);

const name = userName;

(async () => {
  await mongoose.connect(env.mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const userId = mongoose.Types.ObjectId().toHexString();

  const reacto = await CompanyModel.create({
    _id: mongoose.Types.ObjectId().toHexString(),
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
})();
