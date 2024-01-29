import { Injectable } from '@angular/core';
import { WeatherReportService } from '../weather/weather-report.service';
import { weatherData } from 'src/interfaces';

@Injectable()
export class SharableService {
  constructor(private weatherService: WeatherReportService) {}

  transformWeatherReport = (location: string) => {
    const address = location.trim()

    this.weatherService.getWeatherReport(address)
    .then(async res => {
      const time = res.current.last_updated.split(" ")[1].split(":")
      const hour = parseInt(time[0])%12 < 10 ? "0" : "" + (parseInt(time[0])%12).toString()
      const min = time[1]
      const prefix = parseInt(time[0]) > 11 ? "PM" : "AM";

      const transformedReport: weatherData = {
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
          prefix: prefix
        },
      }
    })
    .catch()
  }

}
