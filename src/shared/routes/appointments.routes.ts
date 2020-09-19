import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsService from '../../modules/appointments/services/appointments.service';
import ensureAuthenticated from '../middlewares/ensure-authenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsService = new AppointmentsService();
  const appointments = await appointmentsService.findAll();
  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { providerId, date } = request.body;
  const appointmentsService = new AppointmentsService();

  const parsedDate = parseISO(date);

  const appointment = await appointmentsService.create({
    providerId,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
