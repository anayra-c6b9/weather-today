export interface weatherData {
  has_error: boolean;
  city: string;
  region: string;
  country: string;
  temperature: number;
  condition: string;
  wind_speed: number;
  humidity: number;
  precipitation: number;
  visibility: string;
  wind_direction: string;
  cloud_cover: Number;
  last_updated: {
    hour: string;
    minute: string;
    prefix: string;
  };
}

export interface weatherError {
  has_error: boolean;
  error: {
    code: number;
    message: string;
  };
}
