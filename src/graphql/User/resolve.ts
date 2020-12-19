import { DocumentType } from '@typegoose/typegoose';
import { AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { join } from 'path';
import { CompanyClass } from '../../classes/Company/Company';
import { Role, UserClass } from '../../classes/User/User';
import mailgun from '../../config/mailgun';
import {
  AdminRole,
  Mutation,
  Query,
  RegularRole,
} from '../../generated/graphql';
import createToken from '../../services/createToken';
import env from '../../services/env';
import { PendingUserModel, UserModel } from '../../services/models';
import {
  AlreadyExistsError,
  Forbidden,
  NotFoundError,
} from '../../utils/errors';
import { mapDoc } from '../../utils/map';
import { mapPendingUser, mapUser, mapUserClass } from './map';
import { inviteInputSchema, loginArgsSchema } from './validate';

const user: Query['user'] = async (_, args, context) => {
  if (!context.user) {
    throw new AuthenticationError('');
  }

  const userDoc = await UserModel.findById(args.id);

  if (!userDoc) {
    throw new NotFoundError();
  }

  if (
    context.user.id !== args.id ||
    (context.user.role === AdminRole.admin &&
      context.user.company.id === String(userDoc.company))
  ) {
    throw new Forbidden();
  }

  const user = mapUser(userDoc);

  return user;
};

export const userQuery = {
  user,
};

const logIn: Mutation['logIn'] = async (_, args) => {
  await loginArgsSchema.validateAsync(args.input);

  const userDoc = (await UserModel.findOne({
    email: args.input.email,
  }).populate('company')) as DocumentType<
    Omit<UserClass, 'company'> & { company: DocumentType<CompanyClass> }
  >;

  if (!userDoc) {
    throw new NotFoundError();
  }

  const passwordsMatch = await bcrypt.compare(
    args.input.password,
    userDoc.passwordHash,
  );
  if (!passwordsMatch) {
    throw new AuthenticationError('Invalid credentials.');
  }
  const { company, ...userClass } = mapDoc(userDoc);

  const user = mapUserClass({ ...userClass, company: company._id });

  const token = createToken({
    id: userClass.id,
    name: userClass.name,
    email: userClass.email,
    role: userClass.role === Role.admin ? AdminRole.admin : RegularRole.regular,
    company: {
      id: company._id,
      name: company.name,
    },
  });

  return { __typename: 'LoginOutput', user, token };
};

const invite: Mutation['invite'] = async (_, args, context) => {
  await inviteInputSchema.validateAsync(args.input);

  if (context.user?.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  const userDoc = UserModel.findOne({ email: args.input.email });

  if (userDoc) {
    throw new AlreadyExistsError();
  }

  const pendingUserDoc = await PendingUserModel.create({
    email: args.input.email,
    role: args.input.role,
    company: context.user.id,
  });

  const pendingUser = mapPendingUser(pendingUserDoc);

  return new Promise((resolve, reject) =>
    mailgun.sendMail(
      {
        from: env.mailGunUsername,
        to: args.input.email,
        subject: 'Reacto Invitation',
        html: `<h1>Welcome to Reacto</h1>
      <br />
      <br />
      You have been invited to join <strong>${
        context.user?.company.name
      }</strong>.
      <br />
      To complete your registration follow the link below:
      <br/>
      ${join(env.appOrigin, env.appEmailPath)}?email=${args.input.email}`,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(pendingUser);
        }
      },
    ),
  );
};

export const userMutation = {
  logIn,
  invite,
};
