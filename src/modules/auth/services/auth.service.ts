import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import SigInDTO from '../dtos/sigin.dto';
import UsersRepository from '../../users/repositories/users.repository';
import SigInResponseDTO from '../dtos/signin.response.dto';
import authConfig from '../../../config/auth';
import AppError from '../../../shared/errors/AppError';

class AuthService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  public async signIn({
    email,
    password,
  }: SigInDTO): Promise<SigInResponseDTO> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Invalid email/password.', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Invalid email/password.', 401);
    }
    delete user.password;

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthService;
