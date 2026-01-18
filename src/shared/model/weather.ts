export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
}

export interface WeatherData {
  location: string;
  currentTemp: number;
  condition: string;
  highTemp: number;
  lowTemp: number;
  icon: string;
  hourlyForecast: HourlyForecast[];
}

export interface ForecastItem {
  dt_txt: string; // 시간 정보
  main: {
    temp: number; // 온도
  };
  weather: Array<{
    icon: string; // 아이콘 코드
  }>;
}
