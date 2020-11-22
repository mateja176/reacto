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
import { User } from '../../entity/User';
import { Roles } from '../../interfaces/Roles';
import { UserNotFoundError } from './errors';
import { UserInput, UsersArgs } from './types';

@Service()
@Resolver(User)
export class UserResolver {
  @Inject(Identifiers.userRepository) userRepository: Repository<User>;
  @Query(() => User)
  async user(@Arg('id') id: string) {
    const user = await this.userRepository.findOne(id);
    if (user) {
      return user;
    } else {
      throw new UserNotFoundError(id);
    }
  }

  @Query(() => [User])
  users(@Args() { skip, take }: UsersArgs) {
    return this.userRepository.find({ skip, take });
  }

  @Mutation(() => User)
  @Authorized()
  createUser(@Arg('input') input: UserInput): Promise<User> {
    const user = new User();
    user.name = input.name;
    return this.userRepository.save(user);
  }

  @Mutation(() => ID)
  @Authorized(Roles.Admin)
  async removeUser(@Arg('id') id: string) {
    await this.userRepository.delete(id);
    return id;
  }
}
