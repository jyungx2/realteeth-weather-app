import type {
  Coordinates,
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

// 현재 위치 가져오기 (재시도 로직 추가)
export const getCurrentPosition = (
  maxRetries = 0,
  retryDelay = 1000
): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("브라우저가 위치 서비스를 지원하지 않습니다."));
      return;
    }

    let retryCount = 0;

    const attemptGetPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          // POSITION_UNAVAILABLE (2) 또는 TIMEOUT (3) 에러면 재시도
          if (
            (error.code === 2 || error.code === 3) &&
            retryCount < maxRetries
          ) {
            retryCount++;
            console.log(
              `위치 정보 가져오기 재시도 중... (${retryCount}/${maxRetries})`
            );
            setTimeout(attemptGetPosition, retryDelay);
          } else {
            // 최대 재시도 횟수 초과 또는 다른 에러
            let errorMessage = "위치 정보를 가져올 수 없습니다.";

            switch (error.code) {
              case 1: // PERMISSION_DENIED
                errorMessage =
                  "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.";
                break;
              case 2: // POSITION_UNAVAILABLE
                errorMessage =
                  "위치 정보를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.";
                break;
              case 3: // TIMEOUT
                errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
                break;
            }

            reject(new Error(errorMessage));
          }
        },
        {
          enableHighAccuracy: false, // GPS 칩이 아닌 네트워크 기반 위치 사용 -> 배터리 절약 및 속도 향상
          timeout: 10000, // 5초 → 10초로 증가
          maximumAge: 300000, // 0 → 5분으로 변경 (캐시된 위치도 허용)
        }
      );
    };

    attemptGetPosition();
  });
};

// 날씨 데이터 가져오기
export const fetchWeatherData = async (
  coords: Coordinates
): Promise<WeatherData> => {
  const { latitude, longitude } = coords;
  console.log("1. Fetching weather data for coords:", coords);

  // 1. 현재 날씨 가져오기
  const currentWeatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
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
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
  };
  console.log("3. Extracted weather info:", weatherData);

  // 2. 시간별 예보 가져오기 (3시간 간격)
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
  );

  if (!forecastResponse.ok) {
    throw new Error("예보 정보를 가져오는데 실패했습니다.");
  }

  const forecastData = await forecastResponse.json();
  console.log("4. Received forecast data:", forecastData);

  // 3. 한국어 도시명 가져오기 (역지오코딩)
  let locationName = "현재 위치";
  try {
    const geoResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
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
