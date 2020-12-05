import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';
import { v4 } from 'uuid';
import ormConfig from '../ormconfig';
import { Company } from '../src/entities/Company/Company';
import { Role, User } from '../src/entities/Company/entities/User/User';
import hashPassword from '../src/services/hashPassword';
import { createEntity } from '../src/utils/createEntity';

(async () => {
  const configConnectionOptions = await getConnectionOptions();
  const connectionOptions = {
    ...configConnectionOptions,
    ...ormConfig,
  } as ConnectionOptions;
  const connection = await createConnection(connectionOptions);

  const companyRepository = connection.getMongoRepository(Company);
  const userRepository = connection.getMongoRepository(User);

  const reacto = companyRepository.create({
    name: 'Reacto',
  });
  reacto.pendingUsers = [];
  reacto.users = [];

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

  const owner = createEntity(userRepository, {
    id: v4(),
    name,
    email,
    passwordHash: await hashPassword(password),
    role: Role.admin,
    questionnaires: [],
  });

  reacto.owner = owner;

  await companyRepository.save(reacto);

  await connection.close();
})();
