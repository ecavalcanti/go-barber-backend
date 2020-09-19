import { Repository, EntityRepository } from 'typeorm';
import User from '../entities/user.entity';

@EntityRepository(User)
class UsersRepository extends Repository<User> {}

export default UsersRepository;
