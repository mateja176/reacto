import commander from 'commander';
import seed from '../src/helpers/seed';

const { userName, email, password } = commander
  .option('-n, --user-name <name>', "User's name")
  .option('-e, --email <email>', "User's email")
  .option('-p, --password <password>', "User's password")
  .parse(process.argv);

const name = userName;

seed({
  name,
  email,
  password,
});
