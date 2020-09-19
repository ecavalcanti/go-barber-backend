import User from '../modules/users/entities/user.entity';

interface SigInResponseDTO {
  user: User;
  token: string;
}

export default SigInResponseDTO;
