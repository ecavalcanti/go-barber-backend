import { Router } from 'express';
import multer from 'multer';
import UsersService from '../../modules/users/services/users.service';
import ensureAuthenticated from '../middlewares/ensure-authenticated';
import uploadConfig from '../../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const usersService = new UsersService();

  const user = await usersService.create({
    name,
    email,
    password,
  });

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const usersService = new UsersService();
    const user = await usersService.updateAvatar({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });
    return response.json(user);
  },
);

export default usersRouter;
