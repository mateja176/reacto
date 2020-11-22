import {
  Arg,
  Args,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { User } from '../../entity/User';
import { Context } from '../../interfaces/interfaces';
import { Roles } from '../../interfaces/Roles';
import { UserNotFoundError } from './errors';
import { UserInput, UsersArgs } from './types';

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  async user(@Arg('id') id: string, @Ctx() context: Context) {
    const userRepository = context.connection.getRepository(User);
    const user = await userRepository.findOne(id);
    if (user) {
      return user;
    } else {
      throw new UserNotFoundError(id);
    }
  }

  @Query(() => [User])
  users(@Args() { skip, take }: UsersArgs, @Ctx() context: Context) {
    const userRepository = context.connection.getRepository(User);
    return userRepository.find({ skip, take });
  }

  @Mutation(() => User)
  @Authorized()
  createUser(
    @Arg('input') input: UserInput,
    @Ctx() context: Context,
  ): Promise<User> {
    const user = new User();
    user.name = input.name;
    const userRepository = context.connection.getRepository(User);
    return userRepository.save(user);
  }

  @Mutation(() => ID)
  @Authorized(Roles.Admin)
  async removeUser(@Arg('id') id: string, @Ctx() context: Context) {
    const userRepository = context.connection.getRepository(User);
    await userRepository.delete(id);
    return id;
  }
}
