import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Car } from '../models/car.model';
import { ParkingLot, ParkingSlot } from '../models/parking-lot.model';
import { StatusResponseItemDto } from '../dto/car.dto';

@Injectable()
export class ParkingService {
  private parkingLot: ParkingLot | null = null;

  createParkingLot(size: number): number {
    if (size <= 0) {
      throw new BadRequestException('Parking lot size must be greater than 0');
    }
    this.parkingLot = new ParkingLot(size);
    return this.parkingLot.totalSlots;
  }

  expandParkingLot(incrementSize: number): number {
    this.ensureParkingLotExists();
    
    if (incrementSize <= 0) {
      throw new BadRequestException('Increment size must be greater than 0');
    }
    
    return this.parkingLot!.expand(incrementSize);
  }

  parkCar(registrationNumber: string, color: string): number {
    this.ensureParkingLotExists();
    
    // Check if car already exists in the parking lot
    const existingSlot = this.parkingLot!.findSlotByRegistrationNumber(registrationNumber);
    if (existingSlot) {
      throw new BadRequestException(`Car with registration number ${registrationNumber} is already parked at slot ${existingSlot.id}`);
    }
    
    const car = new Car(registrationNumber, color);
    const slot = this.parkingLot!.parkCar(car);
    
    if (!slot) {
      throw new BadRequestException('Parking lot is full');
    }
    
    return slot.id;
  }

  clearSlotByNumber(slotNumber: number): number {
    this.ensureParkingLotExists();
    
    const cleared = this.parkingLot!.clearSlot(slotNumber);
    
    if (!cleared) {
      throw new NotFoundException(`Slot number ${slotNumber} is already free or does not exist`);
    }
    
    return slotNumber;
  }

  clearSlotByRegistrationNumber(registrationNumber: string): number {
    this.ensureParkingLotExists();
    
    const slotNumber = this.parkingLot!.clearSlotByRegistrationNumber(registrationNumber);
    
    if (slotNumber === null) {
      throw new NotFoundException(`Car with registration number ${registrationNumber} not found`);
    }
    
    return slotNumber;
  }

  getStatus(): StatusResponseItemDto[] {
    this.ensureParkingLotExists();
    
    const occupiedSlots = this.parkingLot!.getOccupiedSlots();
    
    return occupiedSlots.map(slot => ({
      slot_no: slot.id,
      registration_no: slot.car!.registrationNumber,
      color: slot.car!.color,
    }));
  }

  getRegistrationNumbersByColor(color: string): string[] {
    this.ensureParkingLotExists();
    
    const registrationNumbers = this.parkingLot!.getRegistrationNumbersByColor(color);
    
    if (registrationNumbers.length === 0) {
      throw new NotFoundException(`No cars found with color ${color}`);
    }
    
    return registrationNumbers;
  }

  getSlotNumbersByColor(color: string): number[] {
    this.ensureParkingLotExists();
    
    const slotNumbers = this.parkingLot!.getSlotNumbersByColor(color);
    
    if (slotNumbers.length === 0) {
      throw new NotFoundException(`No cars found with color ${color}`);
    }
    
    return slotNumbers;
  }

  getSlotNumberByRegistrationNumber(registrationNumber: string): number {
    this.ensureParkingLotExists();
    
    const slot = this.parkingLot!.findSlotByRegistrationNumber(registrationNumber);
    
    if (!slot) {
      throw new NotFoundException(`Car with registration number ${registrationNumber} not found`);
    }
    
    return slot.id;
  }

  private ensureParkingLotExists(): void {
    if (!this.parkingLot) {
      throw new BadRequestException('Parking lot has not been initialized');
    }
  }
} 