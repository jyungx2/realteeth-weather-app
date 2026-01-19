import type { Coordinates } from "@/shared/model/location";
import type {
  ForecastItem,
  HourlyForecast,
  WeatherData,
} from "@/shared/model/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// OpenWeather API 아이콘 코드를 이모지로 변환
const getWeatherIcon = (iconCode: string): string => {
  // 앞 두 자리만 추출 (01, 02, 03...)
  const weatherCode = iconCode.slice(0, 2);

  const iconMap: { [key: string]: string } = {
    "01": "☀️", // 맑음 (clear sky)
    "02": "🌤️", // 구름 조금 (few clouds)
    "03": "☁️", // 구름 많음 (scattered clouds)
    "04": "☁️", // 흐림 (broken clouds)
    "09": "🌧️", // 소나기 (shower rain)
    "10": "🌦️", // 비 (rain)
    "11": "⛈️", // 천둥번개 (thunderstorm)
    "13": "🌨️", // 눈 (snow)
    "50": "🌫️", // 안개 (mist)
  };
  return iconMap[weatherCode] || "☀️";
};

// 날씨 데이터 가져오기
export const fetchWeatherData = async (
  coords: Coordinates,
): Promise<WeatherData> => {
  const { latitude, longitude } = coords;
  console.log("1. Fetching weather data for coords:", coords);

  // 1. 현재 날씨 가져오기
  const currentWeatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`,
  );

  if (!currentWeatherResponse.ok) {
    throw new Error("날씨 정보를 가져오는데 실패했습니다.");
  }

  const data = await currentWeatherResponse.json();
  console.log("2. Received weather data:", data);

  // 필요한 데이터만 정제
  const weatherData = {
    location: data.name || "현재 위치",
    currentTemp: Math.round(data.main.temp),
    lowTemp: Math.round(data.main.temp_min),
    highTemp: Math.round(data.main.temp_max),
    condition: data.weather[0].description,
    icon: getWeatherIcon(data.weather[0].icon),
  };
  console.log("3. Extracted weather info:", weatherData);

  // 2. 시간별 예보 가져오기 (3시간 간격)
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`,
  );

  if (!forecastResponse.ok) {
    throw new Error("예보 정보를 가져오는데 실패했습니다.");
  }

  const forecastData = await forecastResponse.json();
  console.log("4. Received forecast data:", forecastData);

  // 3. 한국어 도시명 가져오기 (역지오코딩)
  let locationName = "";
  try {
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`,
    );
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      console.log("5. Received geo data:", geoData);

      if (geoData.length > 0) {
        locationName = geoData[0].local_names?.ko || geoData[0].name;
      }
    }
  } catch (error) {
    console.warn("위치 이름을 가져오는데 실패했습니다:", error);
  }

  // 4. 시간별 예보 데이터 가공 + 일출/일몰 마커 추가
  const hourlyForecast: HourlyForecast[] = [];

  forecastData.list?.slice(0, 20).forEach((item: ForecastItem) => {
    const date = new Date(item.dt_txt);
    const hour = date.getHours();

    hourlyForecast.push({
      time: `${hour}시`,
      temp: Math.round(item.main.temp),
      icon: getWeatherIcon(item.weather[0].icon),
    });
  });

  return {
    location: locationName,
    currentTemp: weatherData.currentTemp,
    highTemp: weatherData.highTemp,
    lowTemp: weatherData.lowTemp,
    condition: weatherData.condition,
    icon: weatherData.icon,
    hourlyForecast,
  };
};
