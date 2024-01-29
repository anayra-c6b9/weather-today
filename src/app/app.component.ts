import { Component } from '@angular/core';
import { WeatherReportService } from './services/weather/weather-report.service';
import { SharableService } from './services/sharables/sharable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SharableService]
})
export class AppComponent {
  constructor (private weatherApiService: WeatherReportService) {}

  ngOnInit() {
    try {
      this.weatherApiService.getUserIp()
      .then(res => {
        return this.weatherApiService.getWeatherReport(res.ip)
      })
      .then(res => {
        console.log(res)
      })
    } catch (error) {
      console.log(error)
    }
  }


}
