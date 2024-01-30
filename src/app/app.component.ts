import { Component } from '@angular/core';
import { WeatherReportService } from './services/weather/weather-report.service';
import { SharableService } from './services/sharables/sharable.service';
import { Subscription } from 'rxjs';
import { weatherData, weatherError } from 'src/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SharableService],
})
export class AppComponent {
  weatherSubscription: Subscription;
  weatherdata: weatherData | weatherError = {
    has_error: true,
    error: {
      code: 101,
      message: 'Add a location',
    },
  };

  constructor(
    private sharableService: SharableService,
    private weatherService: WeatherReportService
  ) {
    this.weatherSubscription = this.weatherService.weatherData$.subscribe(
      (data) => {
        this.weatherdata = data;
      }
    );
  }

  ngOnInit() {
    this.sharableService.getInitialWeatherReport();
  }

  ngOnDestroy() {
    this.weatherSubscription.unsubscribe();
  }
}
