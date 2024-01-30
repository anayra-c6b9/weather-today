import { Injectable } from '@angular/core';
import { WeatherReportService } from '../weather/weather-report.service';
import { weatherData, weatherError, weatherIconJsonCollection } from 'src/interfaces';
import { Subject } from 'rxjs';
import * as weatherIconData from "../../weathercode.json"

@Injectable()
export class SharableService {
  jsonData: weatherIconJsonCollection = weatherIconData
  jsonDataSimplified: weatherIconJsonCollection = []

  constructor(private weatherService: WeatherReportService) {
    this.searchButtonStateSubject.next(false)
    for(let i in this.jsonData) {
      this.jsonDataSimplified.push(
        this.jsonData[i]
      )
    }
  }

  selectSpecifiedData = (res: any): weatherData => {
    const time = res.current.last_updated.split(' ')[1].split(':');
    // console.log(((parseInt(time[0]) % 13) + Math.floor(parseInt(time[0]) / 12)).toString())
    const hour = parseInt(time[0]) > 12 ? '0' + Math.floor(parseInt(time[0])/13).toString() : time[0]
    const min = time[1];
    const prefix = (parseInt(time[0]) > 11) ? 'PM' : 'AM';
    const iconData = this.jsonDataSimplified.filter(x => x.code === res.current.condition.code)[0]
    // console.log(this.jsonDataSimplified)
    // console.log(iconData)

    const transformedReport: weatherData = {
      has_error: false,
      city: res.location.name,
      region: res.location.region,
      country: res.location.country,
      temperature: res.current.temp_c,
      icon: (parseInt(time[0]) > 4 && parseInt(time[0]) < 18) ? iconData.day : iconData.night,
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

  private transformWeatherReport = (location: string) => {
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

  getWeatherReport = (query: string) => {
    this.transformWeatherReport(query)
  }

  // search controller

  private searchButtonStateSubject = new Subject<boolean>;
  searchButtonState$ = this.searchButtonStateSubject.asObservable();

  toggleButtonState = (state: boolean) => {
      this.searchButtonStateSubject.next(state)
  }
}
