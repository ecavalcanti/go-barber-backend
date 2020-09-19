import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import User from '../entities/user.entity';
import CreateUserDTO from '../dtos/create-user.dto';
import UsersRepository from '../repositories/users.repository';
import UpdateUserAvatarDTO from '../dtos/update-user-avatar.dto';
import uploadConfig from '../../../config/upload';
import AppError from '../../../shared/errors/AppError';

class UsersService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  public async create({ name, email, password }: CreateUserDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 10);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    delete user.password;

    return user;
  }

  public async updateAvatar({
    userId,
    avatarFilename,
  }: UpdateUserAvatarDTO): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await this.usersRepository.save(user);
    delete user.password;

    return user;
  }
}

export default UsersService;
