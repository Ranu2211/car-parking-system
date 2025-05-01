import { IsInt, Min } from 'class-validator';

export class CreateParkingLotDto {
  @IsInt()
  @Min(1, { message: 'Parking lot size must be at least 1' })
  readonly no_of_slot: number;
}

export class CreateParkingLotResponseDto {
  readonly total_slot: number;
}

export class ExpandParkingLotDto {
  @IsInt()
  @Min(1, { message: 'Increment size must be at least 1' })
  readonly increment_slot: number;
}

export class ExpandParkingLotResponseDto {
  readonly total_slot: number;
} 