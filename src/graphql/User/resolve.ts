import { ApolloError, AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { join } from 'path';
import { v4 } from 'uuid';
import mailgun from '../../config/mailgun';
import { AdminRole, Mutation, Query } from '../../generated/graphql';
import createToken from '../../services/createToken';
import env from '../../services/env';
import hashPassword from '../../services/hashPassword';
import {
  AlreadyExistsError,
  Forbidden,
  NotAuthenticatedError,
  NotFoundError,
} from '../../utils/errors';
import { filterInputSchema, ValidatedFilterInput } from '../../utils/validate';
import { mapPendingUser, mapUser } from './map';
import {
  inviteInputSchema,
  loginArgsSchema,
  registerInputSchema,
} from './validate';

const user: Query['user'] = async (_, args, context) => {
  if (!context.user) {
    throw new AuthenticationError('');
  }

  const userDoc = await context.models.User.findById(args.id);

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

  const user = mapUser(context.models)(userDoc);

  return user;
};

const users: Query['users'] = async (_, args, context) => {
  const {
    skip,
    limit,
  }: ValidatedFilterInput = await filterInputSchema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  if (context.user.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  const userDocs = await context.models.User.find({
    company: String(context.user.company),
  })
    .skip(skip)
    .limit(limit);

  return userDocs.map(mapUser(context.models));
};

export const userQuery = {
  user,
  users,
};

const logIn: Mutation['logIn'] = async (_, args, context) => {
  await loginArgsSchema.validateAsync(args.input);

  const userDoc = await context.models.User.findOne({
    email: args.input.email,
  });

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

  const user = mapUser(context.models)(userDoc);

  const token = createToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: { id: String(userDoc.company) },
  });

  return { __typename: 'LoginOutput', user, token };
};

const invite: Mutation['invite'] = async (_, args, context) => {
  await inviteInputSchema.validateAsync(args.input);

  if (!context.user) {
    throw new NotAuthenticatedError();
  }

  if (context.user.role !== AdminRole.admin) {
    throw new Forbidden();
  }

  const userDoc = await context.models.User.findOne({
    email: args.input.email,
  });

  if (userDoc) {
    throw new AlreadyExistsError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const token = v4();

  const pendingUserDoc = await context.models.PendingUser.create({
    email: args.input.email,
    role: args.input.role,
    token,
    company: context.user.id,
  });

  const companyDoc = await context.models.Company.findOneAndUpdate(
    { _id: context.user.company.id },
    { $push: { pendingUsers: pendingUserDoc._id } },
  );

  if (!companyDoc) {
    throw new ApolloError('Company not found.');
  }

  await session.commitTransaction();

  session.endSession();

  const pendingUser = mapPendingUser(context.models)(pendingUserDoc);

  return new Promise((resolve, reject) =>
    mailgun.sendMail(
      {
        from: env.mailGunEmail,
        to: args.input.email,
        subject: 'Reacto Invitation',
        html: `<h1>Welcome to Reacto</h1>
      <h2>
        You have been invited to join ${companyDoc.name}
      </h2>
      <p>
        To complete your registration follow <a href=${`${join(
          env.appOrigin,
          env.appEmailPath,
        )}?token=${token}`}>this link</a>.
      </p>
      <br/>`,
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

const register: Mutation['register'] = async (_, args, context) => {
  await registerInputSchema.validateAsync(args.input);

  const pendingUserDoc = await context.models.PendingUser.findOne({
    token: args.input.token,
  });

  if (!pendingUserDoc) {
    throw new NotFoundError();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const passwordHash = await hashPassword(args.input.password);

  const companyId = String(pendingUserDoc.company);

  const userDoc = await context.models.User.create({
    company: companyId,
    email: pendingUserDoc.email,
    role: pendingUserDoc.role,
    name: args.input.name,
    passwordHash,
    questionnaires: [],
  });

  await context.models.PendingUser.remove({ _id: pendingUserDoc._id });

  await context.models.Company.updateOne(
    { _id: companyId },
    {
      $pull: { pendingUsers: pendingUserDoc._id },
    },
  );

  await session.commitTransaction();
  session.endSession();

  const user = mapUser(context.models)(userDoc);

  const token = createToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: {
      id: companyId,
    },
  });

  return {
    __typename: 'RegisterOutput',
    token,
    user,
  };
};

export const userMutation = {
  logIn,
  invite,
  register,
};
