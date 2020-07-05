import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';

import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { RestaurantDto } from './dtos/restaurant.dto';
import { GetRestaurantsDto } from './dtos/get-restaurants.dto';

describe('Restaurants Controller', () => {
  let service: RestaurantsService;
  let controller: RestaurantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [RestaurantsController],
      providers: [
        {
          provide: RestaurantsService,
          useValue: {
            getRestaurants: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<RestaurantsService>(RestaurantsService);
    controller = module.get<RestaurantsController>(RestaurantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send the request and get the response of the nearest restaurants', async () => {
    const restaurants: RestaurantDto[] = [
      {
        name: "ke'shurretiados",
        rating: 4.3,
        types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
        latitude: 6.17763,
        longitude: -75.5983648,
        googlePlaceId: 'ChIJyb-ZGjiCRo4RwnAok7Mf30M',
      },
    ];
    const getRestaurantsDto: GetRestaurantsDto = {
      latitude: '6.17763',
      longitude: '-75.5983648',
      radius: 1000,
    };
    (service.getRestaurants as jest.Mock).mockResolvedValue(restaurants);
    const returnedRestaurants = await controller.getRestaurants(
      getRestaurantsDto,
    );
    expect(returnedRestaurants).toBe(restaurants);
    expect(service.getRestaurants).toHaveBeenCalledWith(getRestaurantsDto);
  });
});
