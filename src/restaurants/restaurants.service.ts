import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client,
  PlacesNearbyRequest,
  PlacesNearbyResponse,
} from '@googlemaps/google-maps-services-js';

import { GetRestaurantsDto } from './dtos/get-restaurants.dto';
import { RestaurantDto } from './dtos/restaurant.dto';

@Injectable()
export class RestaurantsService {
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client();
  }

  async getRestaurants(
    getRestaurantsDto: GetRestaurantsDto,
  ): Promise<RestaurantDto[]> {
    const { latitude, longitude, radius } = getRestaurantsDto;
    const params: PlacesNearbyRequest['params'] = {
      key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
      location: `${latitude},${longitude}`,
      radius: +radius,
      type: 'restaurant',
    };
    const placesNearbyResponse = await this.client
      .placesNearby({
        params,
      })
      .catch(() => {
        throw new ServiceUnavailableException(
          'The places API threw an unexpected error',
        );
      });
    return this.mapPlacesNearbyResponseToRestaurants(placesNearbyResponse);
  }

  private mapPlacesNearbyResponseToRestaurants(
    placesNearbyResponse: PlacesNearbyResponse,
  ): RestaurantDto[] {
    return placesNearbyResponse.data.results.map(placeData => {
      const {
        name,
        rating,
        types,
        place_id: googlePlaceId,
        geometry: { location: { lat: latitude, lng: longitude } = {} } = {},
      } = placeData;
      return {
        name,
        rating,
        types,
        latitude,
        longitude,
        googlePlaceId,
      };
    });
  }
}
