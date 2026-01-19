import { useQuery } from "@tanstack/react-query";
import type { Coordinates } from "@/shared/model/location";
import type { WeatherData } from "@/shared/model/weather";
import { fetchWeatherData } from "@/shared/api/fetchWeather";

export const useWeatherByCoords = (coords: Coordinates | null | undefined) => {
  return useQuery({
    queryKey: ["weather", coords?.latitude, coords?.longitude],
    queryFn: async (): Promise<WeatherData> => {
      if (!coords) {
        throw new Error("좌표 정보가 제공되지 않았습니다.");
      }
      return await fetchWeatherData(coords);
    },
    enabled: !!coords, // coords가 있을 때만 실행
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
