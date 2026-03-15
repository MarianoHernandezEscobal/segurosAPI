import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Insurance, InsuranceDocument } from './insurance.schema';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { InsuranceDTO } from './dto/insurance.dto';

@Injectable()
export class InsuranceService {

  constructor(
    @InjectModel(Insurance.name)
    private insuranceModel: Model<InsuranceDocument>,
  ) { }


  async create(data: InsuranceDTO) {
    try {
      data.phone = this.formatPhone(data.phone)
      const insurance = new this.insuranceModel(data);
      return await insurance.save();
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('La matrícula ya está registrada');
      }
      throw e;
    }
  }

  async update(id: string, data: Partial<InsuranceDTO>) {
    try {

      if (data.phone) {
        data.phone = this.formatPhone(data.phone);
      }

      // Si cambian la fecha de vencimiento, reiniciar recordatorio
      if (data.expirationDate) {
        (data as any).reminderSent = false;
      }

      const insurance = await this.insuranceModel.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!insurance) {
        throw new BadRequestException('Seguro no encontrado');
      }

      return insurance;

    } catch (e) {

      if (e.code === 11000) {
        throw new ConflictException('La matrícula ya está registrada');
      }

      throw e;

    }
  }

  private formatPhone(phone: string): string {

    if (!phone) return phone;
    phone = phone.replace(/\s+/g, '')
      .replace('-', '')
      .replace('+', '');
    if (phone.startsWith('0')) {
      phone = phone.substring(1);
    }
    if (!phone.startsWith('598')) {
      phone = `598${phone}`;
    }
    return phone;
  }

  async findAll() {
    return this.insuranceModel.find();
  }

  async getExpiringInsurances() {

    const today = new Date();

    const limitDate = new Date();
    limitDate.setDate(today.getDate() + 7);

    return this.insuranceModel.find({
      expirationDate: { $lte: limitDate },
      reminderSent: false,
    });

  }

  async markReminderSent(id: string) {
    await this.insuranceModel.findByIdAndUpdate(id, {
      reminderSent: true,
    });
  }

}