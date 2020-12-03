import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';
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
import { Role } from '../../entities/User/User';
import { Context } from '../../interfaces/interfaces';
import createToken from '../../services/createToken';
import hashPassword from '../../services/hashPassword';
import {
  createEntity,
  UserPendingRepository,
  UserRepository,
} from '../../utils/container';
import { NotFoundError } from '../../utils/errors';
import {
  LoginInput,
  LoginOutput,
  RegisterInput,
  RegisterOutput,
  UserOutput,
  UsersArgs,
} from './types';

@Resolver(UserOutput)
export class UserResolver {
  constructor(
    private userRepository: UserRepository,
    private userPendingRepository: UserPendingRepository,
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
        return { user, token };
      } else {
        throw new AuthenticationError('Invalid credentials');
      }
    } else {
      throw new AuthenticationError(`User with email "${email}" not found.`);
    }
  }

  @Mutation(() => RegisterOutput)
  async register(@Arg('input') input: RegisterInput): Promise<RegisterOutput> {
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (user) {
      throw new UserInputError(
        `User with email "${input.email}" already exists.`,
      );
    } else {
      const pendingUser = await this.userPendingRepository.findOne({
        where: { email: input.email },
      });
      if (pendingUser) {
        const newUser = createEntity(this.userRepository, {
          email: input.email,
          passwordHash: await hashPassword(input.password),
          name: input.name,
          role: Role.regular,
          questionnaires: [],
          company: pendingUser.company,
        });

        await this.userRepository.save(newUser);

        const token = createToken(newUser);

        return {
          user: newUser,
          token,
        };
      } else {
        throw new ForbiddenError(
          `User with email "${input.email}" is not allowed to perform this action`,
        );
      }
    }
  }
}
