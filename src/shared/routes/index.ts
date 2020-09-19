import { Router } from 'express';

import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
import authRouter from './auth.routes';

const routers = Router();

routers.use('/appointments', appointmentsRouter);
routers.use('/users', usersRouter);
routers.use('/auth', authRouter);

export default routers;
