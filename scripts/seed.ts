import commander from 'commander';
import seed, { getSeedInput } from '../src/helpers/seed';

const { name, email, password } = getSeedInput(commander);

seed({
  name,
  email,
  password,
});
