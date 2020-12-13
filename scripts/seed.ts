import mongoose from 'mongoose';
import { Role } from '../src/classes/User/User';
import env from '../src/services/env';
import hashPassword from '../src/services/hashPassword';
import { CompanyModel, UserModel } from '../src/services/models';

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

  const [, , name, email, password] = process.argv;
  if (!name) {
    throw new Error(
      'The first parameter is required and represents the owner name',
    );
  }
  if (!email) {
    throw new Error(
      'The second parameter is required and represents the owner email',
    );
  }
  if (!password) {
    throw new Error(
      'The third parameter is required and represents the owner password',
    );
  }

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
