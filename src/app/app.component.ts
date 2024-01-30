import { Component, Input } from '@angular/core';
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
  buttonStateSubscription: Subscription;
  weatherdata: weatherData | weatherError = {
    has_error: true,
    error: {
      code: 101,
      message: 'Add a location',
    },
  };
  buttonState: boolean = false

  constructor(
    private sharableService: SharableService,
    private weatherService: WeatherReportService
  ) {
    this.weatherSubscription = this.weatherService.weatherData$.subscribe(
      (data) => {
        this.weatherdata = data;
      }
    );
    this.buttonStateSubscription = this.sharableService.searchButtonState$.subscribe(
      data => {
        this.buttonState = data;
      }
    )
  }

  searchValue : string = ""
  abcd = [1,2,3]

  searchWeather = () => {
    this.sharableService.getWeatherReport(this.searchValue)
  }

  toggleSearchState = () => {
    if (this.buttonState) {
      this.searchWeather()
    } else {
      setTimeout(() => {
        const inputElement = document.getElementsByName("search-input")
        inputElement[0].focus()
      }, 10)
    }
    this.sharableService.toggleButtonState(!this.buttonState)
  }

  ngOnInit() {
    this.sharableService.getInitialWeatherReport();
  }

  ngOnDestroy() {
    this.weatherSubscription.unsubscribe();
  }
}
