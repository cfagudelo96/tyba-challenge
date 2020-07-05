import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RestaurantsService } from './restaurants.service';
import { RestaurantDto } from './dtos/restaurant.dto';
import { GetRestaurantsDto } from './dtos/get-restaurants.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @UseGuards(AuthGuard())
  getRestaurants(
    @Query() getRestaurantsDto: GetRestaurantsDto,
  ): Promise<RestaurantDto[]> {
    return this.restaurantsService.getRestaurants(getRestaurantsDto);
  }
}
