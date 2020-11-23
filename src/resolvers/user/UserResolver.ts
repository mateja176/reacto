import { ForbiddenError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { Identifiers } from '../../container';
import { Role, User } from '../../entities/User';
import { Context } from '../../interfaces/interfaces';
import createToken from '../../services/createToken';
import hashPassword from '../../services/hashPassword';
import {
  InvalidCredentialsError,
  NotFoundByEmailError,
  NotFoundError,
  UserExistsError,
} from '../../utils/errors';
import {
  LoginInput,
  LoginOutput,
  RegisterInput,
  RegisterOutput,
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
  @Authorized()
  async user(@Arg('id') id: string, @Ctx() context: Context) {
    const user = await this.userRepository.findOne(id);

    if (context.user.role === Role.admin) {
      if (user) {
        return user;
      } else {
        throw new NotFoundError(id);
      }
    } else {
      if (user?.id === context.user.id) {
        return user;
      } else {
        throw new ForbiddenError(
          'You are not allowed to perform this operation.',
        );
      }
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

      const token = createToken(user);

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

  @Mutation(() => RegisterOutput)
  async register(@Arg('input') input: RegisterInput): Promise<RegisterOutput> {
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (user) {
      throw new UserExistsError(user.email);
    } else {
      const newUser = new User();
      newUser.email = input.email;
      newUser.passwordHash = await hashPassword(input.password);
      newUser.name = input.name;
      newUser.role = Role.regular;

      await this.userRepository.save(newUser);

      const token = createToken(newUser);

      return {
        user: newUser,
        token,
      };
    }
  }
}
