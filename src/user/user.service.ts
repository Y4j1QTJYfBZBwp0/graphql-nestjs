import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserInput } from './user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: string): Promise<User> {
    const user = this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(userInput: UserInput): Promise<User> {
    const user = this.userRepository.create(userInput);
    return await this.userRepository.save(user);
  }

  async updateUser(id: string, userInput: UserInput): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    await this.userRepository.update(user, { ...userInput });

    const userUpdated = this.userRepository.create({ ...user, ...userInput });

    return userUpdated;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id });

    const wasDeleted = await this.userRepository.delete(user);

    if (wasDeleted) {
      return true;
    }
    return false;
  }
}
