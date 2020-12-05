import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import { join } from 'path';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { v4 } from 'uuid';
import { Company } from '../../../../entities/Company/Company';
import { Role } from '../../../../entities/Company/entities/User/User';
import { UserPending } from '../../../../entities/Company/entities/User/UserPending';
import { Context } from '../../../../interfaces/Context';
import createToken from '../../../../services/createToken';
import env from '../../../../services/env';
import hashPassword from '../../../../services/hashPassword';
import {
  UserPendingRepository,
  UserRepository,
} from '../../../../utils/container';
import { createEntity } from '../../../../utils/createEntity';
import { NotFoundError } from '../../../../utils/errors';
import {
  InviteInput,
  LoginInput,
  LoginOutput,
  RegisterInput,
  RegisterOutput,
  UserOutput,
  UsersArgs,
} from './types/types';

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const auth: mg.Options = {
  auth: {
    api_key: env.mailGunApiKey,
    domain: env.mailGunUsername,
  },
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

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

    if ([Role.admin].includes(context.user.role)) {
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
  @Authorized([Role.admin])
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

  @Authorized([Role.admin])
  @Mutation(() => RegisterOutput)
  async invite(
    @Arg('input') input: InviteInput,
    @Ctx() context: Context,
  ): Promise<UserPending> {
    const company = new Company();
    company.id = context.user.company.id;
    const userPending = createEntity(this.userPendingRepository, {
      id: v4(),
      email: input.email,
      role: input.role,
      company,
    });

    await this.userPendingRepository.save(userPending);

    return new Promise((resolve, reject) =>
      nodemailerMailgun.sendMail(
        {
          from: env.mailGunUsername,
          to: input.email,
          subject: 'Reacto Invitation',
          html: `<h1>Welcome to Reacto</h1>
          <br />
          <br />
          You have been invited to join <strong>${
            context.user.company.name
          }</strong>.
          <br />
          To complete your registration follow the link below:
          <br/>
          ${join(env.appOrigin, env.appEmailPath)}?email=${input.email}`,
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(userPending);
          }
        },
      ),
    );
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
          id: v4(),
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