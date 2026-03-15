import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Insurance, InsuranceSchema } from './insurance.schema';
import { InsuranceService } from './insurance.service';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';

@Module({
  imports: [
    WhatsappModule,
    MongooseModule.forFeature([
      { name: Insurance.name, schema: InsuranceSchema }
    ])
  ],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}