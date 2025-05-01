import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ParkingService } from './parking.service';

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createParkingLot', () => {
    it('should create a parking lot with the specified size', () => {
      const size = 5;
      const result = service.createParkingLot(size);
      expect(result).toEqual(size); 
    });

    it('should throw error if size is not positive', () => {
      expect(() => service.createParkingLot(0)).toThrow(BadRequestException);
      expect(() => service.createParkingLot(-1)).toThrow(BadRequestException);
    });

    it('should override existing parking lot when called multiple times', () => {
      service.createParkingLot(5);
      const result = service.createParkingLot(10);
      expect(result).toEqual(10);
    });
  });

  describe('expandParkingLot', () => {
    it('should throw error if parking lot is not initialized', () => {
      expect(() => service.expandParkingLot(3)).toThrow(BadRequestException);
    });

    it('should expand parking lot with the given size', () => {
      service.createParkingLot(5);
      const result = service.expandParkingLot(3);
      expect(result).toEqual(8);
    });

    it('should throw error if increment size is not positive', () => {
      service.createParkingLot(5);
      expect(() => service.expandParkingLot(0)).toThrow(BadRequestException);
      expect(() => service.expandParkingLot(-1)).toThrow(BadRequestException);
    });
    
    it('should allow multiple expansions', () => {
      service.createParkingLot(5);
      service.expandParkingLot(3);
      const result = service.expandParkingLot(2);
      expect(result).toEqual(10);
    });
  });

  describe('parkCar', () => {
    it('should throw error if parking lot is not initialized', () => {
      expect(() => service.parkCar('ABC123', 'Red')).toThrow(BadRequestException);
    });

    it('should return slot number when car is parked successfully', () => {
      service.createParkingLot(3);
      const slotNumber = service.parkCar('ABC123', 'Red');
      expect(slotNumber).toEqual(1); // First slot
    });

    it('should assign nearest empty slot', () => {
      service.createParkingLot(5);
      const slot1 = service.parkCar('ABC123', 'Red');
      const slot2 = service.parkCar('DEF456', 'Blue');
      service.clearSlotByNumber(slot1); // Clear first slot
      const slot3 = service.parkCar('GHI789', 'Green');
      
      expect(slot1).toEqual(1);
      expect(slot2).toEqual(2);
      expect(slot3).toEqual(1); // Should reuse the first slot
    });

    it('should throw error if car with same registration is already parked', () => {
      service.createParkingLot(5);
      service.parkCar('ABC123', 'Red');
      
      expect(() => service.parkCar('ABC123', 'Blue')).toThrow(BadRequestException);
    });

    it('should throw error if parking lot is full', () => {
      service.createParkingLot(2);
      service.parkCar('ABC123', 'Red');
      service.parkCar('DEF456', 'Blue');
      
      expect(() => service.parkCar('GHI789', 'Green')).toThrow(BadRequestException);
    });
  });

  describe('clearSlotByNumber', () => {
    it('should throw error if parking lot is not initialized', () => {
      expect(() => service.clearSlotByNumber(1)).toThrow(BadRequestException);
    });

    it('should return slot number when slot is cleared successfully', () => {
      service.createParkingLot(3);
      service.parkCar('ABC123', 'Red');
      
      const clearedSlot = service.clearSlotByNumber(1);
      expect(clearedSlot).toEqual(1);
    });

    it('should throw error if slot is already empty', () => {
      service.createParkingLot(3);
      
      expect(() => service.clearSlotByNumber(1)).toThrow(NotFoundException);
    });

    it('should throw error if slot does not exist', () => {
      service.createParkingLot(3);
      
      expect(() => service.clearSlotByNumber(4)).toThrow(NotFoundException);
    });
  });

  describe('clearSlotByRegistrationNumber', () => {
    it('should throw error if parking lot is not initialized', () => {
      expect(() => service.clearSlotByRegistrationNumber('ABC123')).toThrow(BadRequestException);
    });

    it('should return slot number when car is removed successfully', () => {
      service.createParkingLot(3);
      service.parkCar('ABC123', 'Red');
      
      const clearedSlot = service.clearSlotByRegistrationNumber('ABC123');
      expect(clearedSlot).toEqual(1);
    });

    it('should throw error if car with given registration number is not found', () => {
      service.createParkingLot(3);
      
      expect(() => service.clearSlotByRegistrationNumber('ABC123')).toThrow(NotFoundException);
    });
  });

  describe('getStatus', () => {
    it('should throw error if parking lot is not initialized', () => {
      expect(() => service.getStatus()).toThrow(BadRequestException);
    });

    it('should return empty array if no cars are parked', () => {
      service.createParkingLot(3);
      
      const status = service.getStatus();
      expect(status).toEqual([]);
    });

    it('should return status of all parked cars', () => {
      service.createParkingLot(3);
      service.parkCar('ABC123', 'Red');
      service.parkCar('DEF456', 'Blue');
      
      const status = service.getStatus();
      expect(status).toHaveLength(2);
      expect(status).toEqual(expect.arrayContaining([
        expect.objectContaining({ slot_no: 1, registration_no: 'ABC123', color: 'Red' }),
        expect.objectContaining({ slot_no: 2, registration_no: 'DEF456', color: 'Blue' })
      ]));
    });
  });

  describe('getRegistrationNumbersByColor', () => {
    it('should throw error if parking lot is not initialized', () => {
      expect(() => service.getRegistrationNumbersByColor('Red')).toThrow(BadRequestException);
    });

    it('should throw error if no cars with given color are found', () => {
      service.createParkingLot(3);
      
      expect(() => service.getRegistrationNumbersByColor('Red')).toThrow(NotFoundException);
    });

    it('should return registration numbers of cars with given color', () => {
      service.createParkingLot(5);
      service.parkCar('ABC123', 'Red');
      service.parkCar('DEF456', 'Blue');
      service.parkCar('GHI789', 'Red');
      
      const registrationNumbers = service.getRegistrationNumbersByColor('Red');
      expect(registrationNumbers).toHaveLength(2);
      expect(registrationNumbers).toEqual(expect.arrayContaining(['ABC123', 'GHI789']));
    });

    it('should be case insensitive when matching colors', () => {
      service.createParkingLot(3);
      service.parkCar('ABC123', 'Red');
      
      const registrationNumbers = service.getRegistrationNumbersByColor('red');
      expect(registrationNumbers).toEqual(['ABC123']);
    });
  });

  describe('getSlotNumbersByColor', () => {
    it('should throw error if parking lot is not initialized', () => {
      expect(() => service.getSlotNumbersByColor('Red')).toThrow(BadRequestException);
    });

    it('should throw error if no cars with given color are found', () => {
      service.createParkingLot(3);
      
      expect(() => service.getSlotNumbersByColor('Red')).toThrow(NotFoundException);
    });

    it('should return slot numbers of cars with given color', () => {
      service.createParkingLot(5);
      service.parkCar('ABC123', 'Red');
      service.parkCar('DEF456', 'Blue');
      service.parkCar('GHI789', 'Red');
      
      const slotNumbers = service.getSlotNumbersByColor('Red');
      expect(slotNumbers).toHaveLength(2);
      expect(slotNumbers).toEqual(expect.arrayContaining([1, 3]));
    });

    it('should be case insensitive when matching colors', () => {
      service.createParkingLot(3);
      service.parkCar('ABC123', 'Red');
      
      const slotNumbers = service.getSlotNumbersByColor('red');
      expect(slotNumbers).toEqual([1]);
    });
  });

  describe('getSlotNumberByRegistrationNumber', () => {
    it('should throw error if parking lot is not initialized', () => {
      expect(() => service.getSlotNumberByRegistrationNumber('ABC123')).toThrow(BadRequestException);
    });

    it('should throw error if car with given registration number is not found', () => {
      service.createParkingLot(3);
      
      expect(() => service.getSlotNumberByRegistrationNumber('ABC123')).toThrow(NotFoundException);
    });

    it('should return slot number of car with given registration number', () => {
      service.createParkingLot(3);
      service.parkCar('ABC123', 'Red');
      service.parkCar('DEF456', 'Blue');
      
      const slotNumber = service.getSlotNumberByRegistrationNumber('DEF456');
      expect(slotNumber).toEqual(2);
    });
  });

}); 