import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { InsuranceModule } from './insurance/insurance.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { CronModule } from './cron/cron.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    InsuranceModule,
    WhatsappModule,
    CronModule,
  ],
})
export class AppModule {}