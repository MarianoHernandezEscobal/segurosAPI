import { Body, Controller, Get, Post } from '@nestjs/common';
import { InsuranceService } from './insurance.service';

@Controller('seguros')
export class SegurosController {

  constructor(private insuranceService: InsuranceService) {}

  @Post()
  create(@Body() body: any) {
    return this.insuranceService.create(body);
  }

  @Get()
  findAll() {
    return this.insuranceService.findAll();
  }

  @Post('test-whatsapp')
  sendTest(@Body() body: { phone: string }) {
    return this.insuranceService.sendTest(body.phone);
  }

}