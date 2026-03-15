import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { InsuranceService } from '../insurance/insurance.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class ReminderCron {

  constructor(
    private insuranceService: InsuranceService,
    private whatsappService: WhatsappService,
  ) { }

  @Cron('0 9 * * *')
  async handleCron() {

    console.log('Ejecutando cron de seguros');

    const insurances =
      await this.insuranceService.getExpiringInsurances();

    for (const insurance of insurances) {

      const date = new Date(insurance.expirationDate);

      const formattedDate = date.toLocaleDateString('es-UY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const message = `Hola ${insurance.name} 👋

Tu seguro de ${insurance.type}
Matrícula: ${insurance.tuition}
📅 Vence: ${formattedDate}

Por favor recuerda pagarlo a tiempo.`;

      await this.whatsappService.sendMessage(
        insurance.phone,
        message,
      );

      await this.insuranceService.markReminderSent(
        insurance._id.toString(),
      );
    }

  }
}