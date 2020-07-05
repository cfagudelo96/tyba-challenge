import { IsNumberString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetRestaurantsDto {
  private static readonly LOWER_RADIUS_LIMIT = 10;

  private static readonly UPPER_RADIUS_LIMIT = 10000;

  @IsNumberString()
  latitude: string;

  @IsNumberString()
  longitude: string;

  @Transform(radius => +radius)
  @Min(GetRestaurantsDto.LOWER_RADIUS_LIMIT)
  @Max(GetRestaurantsDto.UPPER_RADIUS_LIMIT)
  radius = 1000;
}
