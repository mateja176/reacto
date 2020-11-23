import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  Arg,
  Args,
  Authorized,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { Identifiers } from '../../container';
import { Role, User } from '../../entities/User';
import env from '../../utils/env';
import {
  InvalidCredentialsError,
  NotFoundByEmailError,
  NotFoundError,
} from '../../utils/errors';
import {
  LoginInput,
  LoginOutput,
  UserInput,
  UserOutput,
  UsersArgs,
} from './types';

@Service()
@Resolver(UserOutput)
export class UserResolver {
  constructor(
    @Inject(Identifiers.userRepository)
    private userRepository: Repository<User>,
  ) {}
  @Query(() => UserOutput)
  async user(@Arg('id') id: string) {
    const user = await this.userRepository.findOne(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundError(id);
    }
  }

  @Query(() => [UserOutput])
  @Authorized(Role.admin)
  users(@Args() { skip, take }: UsersArgs) {
    return this.userRepository.find({ skip, take });
  }

  @Mutation(() => LoginOutput)
  async logIn(
    @Arg('input') { email, password }: LoginInput,
  ): Promise<LoginOutput> {
    const userEntity = await this.userRepository.findOne({ where: { email } });

    if (userEntity) {
      const { passwordHash, ...user } = userEntity;

      const passwordsMatch = await bcrypt.compare(password, passwordHash);

      const token = jwt.sign({ ...user, id: String(user.id) }, env.jwtSecret, {
        algorithm: 'HS256',
      });

      if (passwordsMatch) {
        console.log({ user, token });
        return { user, token };
      } else {
        throw new InvalidCredentialsError();
      }
    } else {
      throw new NotFoundByEmailError(email);
    }
  }

  @Mutation(() => UserOutput)
  @Authorized(Role.admin)
  createUser(@Arg('input') input: UserInput): Promise<UserOutput> {
    const user = new UserOutput();
    user.name = input.name;
    user.role = input.role;
    return this.userRepository.save(user);
  }

  @Mutation(() => ID)
  @Authorized(Role.admin)
  async removeUser(@Arg('id') id: string) {
    await this.userRepository.delete(id);
    return id;
  }
}
