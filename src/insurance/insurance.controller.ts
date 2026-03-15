import { Body, Controller, Get, Post, Put, Param, UseGuards } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { InsuranceDTO } from './dto/insurance.dto';
import { AuthorizationGuard } from '../guards/authorization.guard';
@Controller('seguros')
export class InsuranceController {

  constructor(private insuranceService: InsuranceService) { }

  @Post()
  @UseGuards(AuthorizationGuard)
  create(@Body() body: InsuranceDTO) {
    return this.insuranceService.create(body);
  }

  @Get()
  @UseGuards(AuthorizationGuard)
  findAll() {
    return this.insuranceService.findAll();
  }
  
  @Put(':id')
  @UseGuards(AuthorizationGuard)
  update(
    @Param('id') id: string,
    @Body() body: Partial<InsuranceDTO>
  ) {
    return this.insuranceService.update(id, body);
  }

}