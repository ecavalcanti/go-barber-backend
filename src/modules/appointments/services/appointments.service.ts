import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../entities/appointment.entity';
import CreateAppointmentDTO from '../dtos/create-appointment.dto';
import AppointmentsRepository from '../repositories/appointments.repository';
import AppError from '../../../shared/errors/AppError';

class AppointmentsService {
  private appointmentsRepository: AppointmentsRepository;

  constructor() {
    this.appointmentsRepository = getCustomRepository(AppointmentsRepository);
  }

  public findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find();
  }

  public async create({
    providerId,
    date,
  }: CreateAppointmentDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked!');
    }

    const appointment = this.appointmentsRepository.create({
      providerId,
      date: appointmentDate,
    });

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsService;
