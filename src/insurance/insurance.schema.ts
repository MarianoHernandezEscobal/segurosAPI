import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InsuranceDocument = Insurance & Document;

@Schema()
export class Insurance {

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  tuition: string;

  @Prop()
  type: string;

  @Prop()
  expirationDate: Date;

}

export const InsuranceSchema = SchemaFactory.createForClass(Insurance);