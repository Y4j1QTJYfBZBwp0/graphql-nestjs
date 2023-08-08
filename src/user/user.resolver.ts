import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Query } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserInput } from './user.input';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((type) => [User])
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @Query((type) => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return await this.userService.findUserById(id);
  }

  @Mutation((returns) => User)
  async createUser(@Args('user') userInput: UserInput): Promise<User> {
    return this.userService.createUser(userInput);
  }

  @Mutation((returns) => User)
  async updateUser(
    @Args('id') id: string,
    @Args('user') userInput: UserInput,
  ): Promise<User> {
    return this.userService.updateUser(id, userInput);
  }

  @Mutation((returns) => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return await this.userService.deleteUser(id);
  }
}
