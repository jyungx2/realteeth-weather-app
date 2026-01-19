import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData } from "@/shared/api/fetchWeather";
import type { Coordinates } from "@/shared/model/location";
import { getCurrentPosition } from "@/shared/api/getCurrentPosition";

export const useCurrentWeather = () => {
  // 위치 정보 가져오기
  const locationQuery = useQuery({
    queryKey: ["location"],
    queryFn: getCurrentPosition as () => Promise<Coordinates>,
    staleTime: 1000 * 60 * 10, // 10분 내로 재요청 시 캐시 사용
    retry: 1,
    refetchOnWindowFocus: true, // 창 돌아올 때 체크
    refetchOnMount: true, // 페이지 이동 시 체크
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
    staleTime: 1000 * 60 * 5, // 캐시 만료 시간 (5분)
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 갱신
    retry: 1,
  });

  return {
    weatherData: weatherQuery.data,
    isLoading: locationQuery.isLoading || weatherQuery.isLoading,
    error: locationQuery.error || weatherQuery.error,
    refetch: weatherQuery.refetch,
  };
};
