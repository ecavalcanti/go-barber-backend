import { Router } from 'express';
import AuthService from '../../modules/auth/services/auth.service';

const authRouter = Router();

authRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authService = new AuthService();

  const { user, token } = await authService.signIn({ email, password });

  return response.json({
    user,
    token,
  });
});

export default authRouter;
