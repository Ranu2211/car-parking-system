import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class ParkCarDto {
  @IsString()
  @IsNotEmpty({ message: 'Car registration number is required' })
  readonly car_reg_no: string;

  @IsString()
  @IsNotEmpty({ message: 'Car color is required' })
  readonly car_color: string;
}

export class ParkCarResponseDto {
  readonly allocated_slot_number: number;
}

export class ClearSlotByNumberDto {
  @IsInt()
  @Min(1, { message: 'Slot number must be at least 1' })
  readonly slot_number: number;
}

export class ClearSlotByRegistrationDto {
  @IsString()
  @IsNotEmpty({ message: 'Car registration number is required' })
  readonly car_registration_no: string;
}

export class ClearSlotResponseDto {
  readonly freed_slot_number: number;
}

export class StatusResponseItemDto {
  readonly slot_no: number;
  readonly registration_no: string;
  readonly color: string;
} 