import { Controller, Post, Patch, Get, Body, Param, NotFoundException, BadRequestException, HttpStatus, HttpCode } from '@nestjs/common';
import { ParkingService } from '../services/parking.service';
import { 
  CreateParkingLotDto, 
  CreateParkingLotResponseDto, 
  ExpandParkingLotDto, 
  ExpandParkingLotResponseDto 
} from '../dto/parking-lot.dto';
import { 
  ParkCarDto, 
  ParkCarResponseDto, 
  ClearSlotByNumberDto, 
  ClearSlotByRegistrationDto, 
  ClearSlotResponseDto, 
  StatusResponseItemDto 
} from '../dto/car.dto';

@Controller()
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  welcome(): { message: string } {
    return { message: 'Welcome to Car Parking System' };
  }

  @Post('parking_lot')
  @HttpCode(HttpStatus.CREATED)
  createParkingLot(@Body() createDto: CreateParkingLotDto): CreateParkingLotResponseDto {
    const totalSlot = this.parkingService.createParkingLot(createDto.no_of_slot);
    return { total_slot: totalSlot };
  }

  @Patch('parking_lot')
  expandParkingLot(@Body() expandDto: ExpandParkingLotDto): ExpandParkingLotResponseDto {
    const totalSlot = this.parkingService.expandParkingLot(expandDto.increment_slot);
    return { total_slot: totalSlot };
  }

  @Post('park')
  @HttpCode(HttpStatus.CREATED)
  parkCar(@Body() parkDto: ParkCarDto): ParkCarResponseDto {
    const slotNumber = this.parkingService.parkCar(parkDto.car_reg_no, parkDto.car_color);
    return { allocated_slot_number: slotNumber };
  }

  @Get('registration_numbers/:color')
  getRegistrationNumbersByColor(@Param('color') color: string): string[] {
    return this.parkingService.getRegistrationNumbersByColor(color);
  }

  @Get('slot_numbers/:color')
  getSlotNumbersByColor(@Param('color') color: string): number[] {
    return this.parkingService.getSlotNumbersByColor(color);
  }

  @Get('slot_number/:registration_number')
  getSlotNumberByRegistrationNumber(@Param('registration_number') regNo: string): { slot_number: number } {
    const slotNumber = this.parkingService.getSlotNumberByRegistrationNumber(regNo);
    return { slot_number: slotNumber };
  }

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  clearSlot(@Body() clearDto: ClearSlotByNumberDto | ClearSlotByRegistrationDto): ClearSlotResponseDto {
    let freedSlotNumber: number;

    if ('slot_number' in clearDto) {
      freedSlotNumber = this.parkingService.clearSlotByNumber(clearDto.slot_number);
    } else if ('car_registration_no' in clearDto) {
      freedSlotNumber = this.parkingService.clearSlotByRegistrationNumber(clearDto.car_registration_no);
    } else {
      throw new BadRequestException('Either slot_number or car_registration_no must be provided');
    }

    return { freed_slot_number: freedSlotNumber };
  }

  @Get('status')
  getStatus(): StatusResponseItemDto[] {
    return this.parkingService.getStatus();
  }
} 