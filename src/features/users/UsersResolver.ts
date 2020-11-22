import { Arg, Args, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Roles } from '../../interfaces/Roles';
import { UserNotFoundError } from './errors';
import { UserService } from './service';
import { User, UserInput, UsersArgs } from './types';

@Resolver(User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async user(@Arg('id') id: string) {
    const user = await this.userService.findById(id);
    if (user === undefined) {
      throw new UserNotFoundError(id);
    }
    return user;
  }

  @Query(() => [User])
  users(@Args() { skip, take }: UsersArgs) {
    return this.userService.findAll({ skip, take });
  }

  @Mutation(() => User)
  @Authorized()
  addUser(@Arg('newUserData') input: UserInput): Promise<User> {
    return this.userService.addNew(input);
  }

  @Mutation(() => Boolean)
  @Authorized(Roles.Admin)
  async removeUser(@Arg('id') id: string) {
    try {
      await this.userService.removeById(id);
      return true;
    } catch {
      return false;
    }
  }
}
