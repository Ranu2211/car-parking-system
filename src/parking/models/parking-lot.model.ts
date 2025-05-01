import { Car } from './car.model';

export class ParkingSlot {
  constructor(
    public id: number,
    public car: Car | null = null,
  ) {}

  get isOccupied(): boolean {
    return this.car !== null;
  }
}

export class ParkingLot {
  private slots: ParkingSlot[] = [];

  constructor(initialSize: number) {
    this.initialize(initialSize);
  }

  private initialize(size: number): void {
    for (let i = 0; i < size; i++) {
      this.slots.push(new ParkingSlot(i + 1));
    }
  }

  get totalSlots(): number {
    return this.slots.length;
  }

  expand(incrementSlots: number): number {
    const currentSize = this.slots.length;
    for (let i = 0; i < incrementSlots; i++) {
      this.slots.push(new ParkingSlot(currentSize + i + 1));
    }
    return this.totalSlots;
  }

  findNearestAvailableSlot(): ParkingSlot | null {
    return this.slots.find(slot => !slot.isOccupied) || null;
  }

  findSlotByRegistrationNumber(registrationNumber: string): ParkingSlot | null {
    return this.slots.find(
      slot => slot.car?.registrationNumber === registrationNumber
    ) || null;
  }

  findSlotsByColor(color: string): ParkingSlot[] {
    return this.slots.filter(
      slot => slot.isOccupied && slot.car?.color.toLowerCase() === color.toLowerCase()
    );
  }

  parkCar(car: Car): ParkingSlot | null {
    const slot = this.findNearestAvailableSlot();
    if (slot) {
      slot.car = car;
    }
    return slot;
  }

  clearSlot(slotNumber: number): boolean {
    const slot = this.slots.find(s => s.id === slotNumber);
    if (slot && slot.isOccupied) {
      slot.car = null;
      return true;
    }
    return false;
  }

  clearSlotByRegistrationNumber(registrationNumber: string): number | null {
    const slot = this.findSlotByRegistrationNumber(registrationNumber);
    if (slot) {
      slot.car = null;
      return slot.id;
    }
    return null;
  }

  getOccupiedSlots(): ParkingSlot[] {
    return this.slots.filter(slot => slot.isOccupied);
  }

  getRegistrationNumbersByColor(color: string): string[] {
    return this.findSlotsByColor(color)
      .map(slot => slot.car?.registrationNumber)
      .filter((regNo): regNo is string => regNo !== undefined);
  }

  getSlotNumbersByColor(color: string): number[] {
    return this.findSlotsByColor(color).map(slot => slot.id);
  }
}
