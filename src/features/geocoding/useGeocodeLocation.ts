// features/geocoding/useGeocodeLocation.ts
import { useQuery } from "@tanstack/react-query";
import { geocodeLocation } from "@/shared/api/nominatim-geocoding";
import type { Coordinates } from "@/shared/model/location";

export const useGeocodeLocation = (locationName: string | null) => {
  return useQuery({
    queryKey: ["geocode", locationName],
    queryFn: async (): Promise<Coordinates> => {
      if (!locationName) {
        throw new Error("위치 이름이 제공되지 않았습니다.");
      }
      return await geocodeLocation(locationName);
    },
    enabled: !!locationName, // locationName이 있을 때만 실행
    staleTime: 1000 * 60 * 60 * 24, // 24시간 (지역 좌표는 변하지 않으니까)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일간 캐시 유지
    retry: 1,
  });
};
