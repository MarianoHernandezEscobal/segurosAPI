import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { InsuranceService } from '../insurance/insurance.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class ReminderCron {

  constructor(
    private insuranceService: InsuranceService,
    private whatsappService: WhatsappService,
  ) {}

  @Cron('0 13 * * *')
  async handleCron() {

    console.log('Ejecutando cron de seguros');

    const insurances =
      await this.insuranceService.getExpiringInsurances();

    for (const insurance of insurances) {

      const message = `Hola ${insurance.name} 👋
Tu seguro de ${insurance.type} vence el ${insurance.expirationDate}`;

      await this.whatsappService.sendMessage(
        insurance.phone,
        message,
      );

    }

  }

}