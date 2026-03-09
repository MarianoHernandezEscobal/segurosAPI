import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Insurance } from './insurance.schema';

@Injectable()
export class InsuranceService {

  constructor(
    @InjectModel(Insurance.name)
    private insuranceModel: Model<Insurance>,
  ) {}

  async getExpiringInsurances() {

    const today = new Date();

    const limitDate = new Date();
    limitDate.setDate(today.getDate() + 7);

    return this.insuranceModel.find({
      expirationDate: { $lte: limitDate },
    });

  }

   async create(data: any) {
    const seguro = new this.seguroModel(data);
    return seguro.save();
  }

}