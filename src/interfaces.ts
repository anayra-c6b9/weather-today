export interface weatherData {
    city: string,
    region: string,
    country: string,
    temperature: number,
    condition: string,
    wind_speed: number,
    humidity: number,
    precipitation: number,
    visibility: string,
    wind_direction: string,
    cloud_cover: Number,
    last_updated: {
        hour: string,
        minute: string,
        prefix: string,
    },
}