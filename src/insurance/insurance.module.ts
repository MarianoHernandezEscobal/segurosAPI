import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Insurance, InsuranceSchema } from './insurance.schema';
import { InsuranceService } from './insurance.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Insurance.name, schema: InsuranceSchema }
    ])
  ],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}