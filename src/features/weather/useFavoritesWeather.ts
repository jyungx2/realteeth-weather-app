// features/weather/useFavoritesWeather.ts
import { useQueries } from "@tanstack/react-query";
import type { LocationWithCoords } from "@/shared/model/location";
import { fetchWeatherData } from "@/shared/api/fetchWeather";

export const useFavoritesWeather = (favorites: LocationWithCoords[]) => {
  const weatherQueries = useQueries({
    queries: favorites.map((fav) => ({
      queryKey: ["weather", fav.lat, fav.lng],
      queryFn: () =>
        fetchWeatherData({
          latitude: fav.lat,
          longitude: fav.lng,
        }),
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    })),
  });

  // 전체 로딩 상태
  const isLoading = weatherQueries.some((query) => query.isLoading);

  // 즐겨찾기 + 날씨 데이터 결합
  const favoritesWithWeather = favorites.map((fav, index) => ({
    ...fav,
    currentTemp: weatherQueries[index].data?.currentTemp,
    highTemp: weatherQueries[index].data?.highTemp,
    lowTemp: weatherQueries[index].data?.lowTemp,
    condition: weatherQueries[index].data?.condition,
    hourlyForecast: weatherQueries[index].data?.hourlyForecast,
    isLoading: weatherQueries[index].isLoading,
  }));

  return {
    favoritesWithWeather,
    isLoading,
    queries: weatherQueries, // 개별 쿼리 접근 필요 시
  };
};
