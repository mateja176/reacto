import bcrypt from 'bcrypt';

const hashPassword = (password: string) => bcrypt.hash(password, 10);

export default hashPassword;
