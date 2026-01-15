import { useQuery } from "@tanstack/react-query";
import { getCurrentPosition, fetchWeatherData } from "@/shared/api/weather";
import type { Coordinates } from "@/shared/model/weather";

export const useWeather = () => {
  // 위치 정보 가져오기
  const locationQuery = useQuery({
    queryKey: ["location"],
    queryFn: getCurrentPosition as () => Promise<Coordinates>,
    staleTime: 1000 * 60 * 60, // 1시간
    retry: 0,
  });

  const coordinates = locationQuery.data;

  // 날씨 정보 가져오기 (위치 정보가 있을 때만)
  const weatherQuery = useQuery({
    queryKey: ["weather", coordinates],
    queryFn: async () => {
      if (!coordinates) {
        throw new Error("위치 정보를 가져올 수 없습니다.");
      }
      return fetchWeatherData(coordinates);
    },
    enabled: !!coordinates, // coordinates가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분
    retry: 2,
  });

  return {
    weatherData: weatherQuery.data,
    isLoading: locationQuery.isLoading || weatherQuery.isLoading,
    error: locationQuery.error || weatherQuery.error,
    refetch: weatherQuery.refetch,
  };
};
