export interface weatherData {
  has_error: false;
  city: string;
  region: string;
  country: string;
  temperature: number;
  icon: Array<string>;
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
  has_error: true;
  error: {
    code: number;
    message: string;
  };
}

export interface weatherIconJson {
  code: number;
  day: Array<string>;
  night: Array<string>;
}

export interface weatherIconJsonCollection extends Array<weatherIconJson> {}