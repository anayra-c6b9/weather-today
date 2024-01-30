import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { weatherData, weatherError } from 'src/interfaces';

@Injectable({
  providedIn: 'root',
})
export class WeatherReportService {
  prepareUrl = (): string => {
    return environment.weather_api_url + environment.weather_api_key;
  };

  getUrl = (location: string): string => {
    return this.prepareUrl() + '&q=' + location + '&aqi=no';
  };

  constructor(private http: HttpClient) {}

  // observable to store weather

  private weatherDataSource = new Subject<weatherData | weatherError>();
  weatherData$ = this.weatherDataSource.asObservable();

  setWeatherReport = (data: weatherData | weatherError) => {
    this.weatherDataSource.next(data);
  };

  // methods to return promises for api calls

  getUserIp = async (): Promise<any> => {
    const userIpData$ = this.http.get<any>(environment.ip_check_url);
    return await lastValueFrom<String>(userIpData$);
  };

  getWeatherReport = async (location: string): Promise<any> => {
    const weatherData$ = this.http.get<any>(this.getUrl(location));
    return await lastValueFrom<any>(weatherData$);
  };
}
