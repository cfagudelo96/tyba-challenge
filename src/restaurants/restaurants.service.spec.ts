import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { RestaurantsService } from './restaurants.service';

jest.mock('@googlemaps/google-maps-services-js');

describe('RestaurantsService', () => {
  const apiKey = 'test-api-key';

  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(apiKey),
          },
        },
        RestaurantsService,
      ],
    }).compile();
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
