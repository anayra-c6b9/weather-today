import { Injectable } from '@angular/core';
import { WeatherReportService } from '../weather/weather-report.service';
import { weatherData, weatherError } from 'src/interfaces';

@Injectable()
export class SharableService {
  constructor(private weatherService: WeatherReportService) {}

  selectSpecifiedData = (res: any): weatherData => {
    const time = res.current.last_updated.split(' ')[1].split(':');
    const hour =
      parseInt(time[0]) % 12 < 10
        ? '0'
        : '' + (parseInt(time[0]) % 12).toString();
    const min = time[1];
    const prefix = parseInt(time[0]) > 11 ? 'PM' : 'AM';

    const transformedReport: weatherData = {
      has_error: false,
      city: res.location.name,
      region: res.location.region,
      country: res.location.country,
      temperature: res.current.temp_c,
      condition: res.current.condition.text,
      wind_speed: res.current.wind_kph,
      humidity: res.current.humidity,
      precipitation: res.current.precip_mm,
      visibility: res.current.vis_km,
      wind_direction: res.current.wind_dir,
      cloud_cover: res.current.cloud,
      last_updated: {
        hour: hour,
        minute: min,
        prefix: prefix,
      },
    };

    return transformedReport;
  };

  transformWeatherReport = (location: string) => {
    const address = location.trim();

    try {
      this.weatherService.getWeatherReport(address).then(async (res) => {
        if (res?.error?.code) {
          res.has_error = true;
          this.weatherService.setWeatherReport(res);
          return;
        }

        const transformedReport: weatherData = this.selectSpecifiedData(res);

        this.weatherService.setWeatherReport(transformedReport);
      });
    } catch (err: any) {
      const customError: weatherError = {
        has_error: true,
        error: {
          code: err?.code || 500,
          message: err.message || 'Cannot connect to endpoints',
        },
      };
      this.weatherService.setWeatherReport(customError);
    }
  };

  getInitialWeatherReport = () => {
    try {
      this.weatherService.getUserIp().then((res) => {
        this.weatherService.getWeatherReport(res.ip).then((res) => {
          if (res?.error?.code) {
            res.has_error = true;
            this.weatherService.setWeatherReport(res);
            return;
          }

          const transformedReport: weatherData = this.selectSpecifiedData(res);
          this.weatherService.setWeatherReport(transformedReport);
        });
      });
    } catch (err: any) {
      const customError: weatherError = {
        has_error: true,
        error: {
          code: err?.code || 500,
          message: err.message || 'Cannot connect to endpoints',
        },
      };
      this.weatherService.setWeatherReport(customError);
    }
  };

  createDummyWeatherData = () => {
    return {
      has_error: true,
      error: {
        code: 500,
        message: 'Enter a location',
      },
    };
  };
}
