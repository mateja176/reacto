import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
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
import { Company } from '../../entities/Company/Company';
import { Role } from '../../entities/User/User';
import { UserPending } from '../../entities/User/UserPending';
import { Context } from '../../interfaces/Context';
import createToken from '../../services/createToken';
import env from '../../services/env';
import hashPassword from '../../services/hashPassword';
import { UserModel, UserPendingModel } from '../../services/models';
import { NotFoundError } from '../../utils/errors';
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

@Resolver()
export class UserResolver {
  @Query(() => UserOutput)
  @Authorized()
  async user(@Arg('id') id: string, @Ctx() context: Context) {
    const user = await UserModel.findById(id);

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
    return UserModel.find({ skip, take });
  }

  @Mutation(() => LoginOutput)
  async logIn(@Arg('input') { email, password }: LoginInput) {
    const userEntity = await UserModel.findOne({ email }).populate('company');
    if (userEntity) {
      const { passwordHash, _id, ...user } = userEntity;
      const passwordsMatch = await bcrypt.compare(password, passwordHash);

      const company = user.company as Company;

      const token = createToken({
        ...user,
        id: _id,
        company: { id: company._id, name: company.name },
      });

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
    const userPending = await UserPendingModel.create({
      _id: mongoose.Types.ObjectId().toHexString(),
      email: input.email,
      role: input.role,
      company: context.user.company.id,
    });

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
  async register(@Arg('input') input: RegisterInput) {
    const user = await UserModel.findOne({
      email: input.email,
    });

    if (user) {
      throw new UserInputError(
        `User with email "${input.email}" already exists.`,
      );
    } else {
      const pendingUser = await UserPendingModel.findOne({
        email: input.email,
      });
      if (pendingUser) {
        const newUser = await UserModel.create({
          _id: mongoose.Types.ObjectId().toHexString(),
          email: input.email,
          passwordHash: await hashPassword(input.password),
          name: input.name,
          role: Role.regular,
          questionnaires: [],
          company: pendingUser.company,
        });

        const company = newUser.company as Company;

        const token = createToken({
          ...newUser,
          id: newUser._id,
          company: { id: company._id, name: company.name },
        });

        return {
          user: { ...newUser, id: newUser._id },
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
