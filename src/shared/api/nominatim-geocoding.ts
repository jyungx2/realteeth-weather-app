import type { Coordinates } from "@/shared/model/types";

/*
 * Nominatim (OpenStreetMap) Geocoding API
 */
export async function NgeocodeLocation(address: string): Promise<Coordinates> {
  try {
    const query = address.trim();

    console.log(`🔍 Geocoding 시작: ${query}`);

    // Nominatim API 호출
    const params = new URLSearchParams({
      q: query,
      format: "json",
      limit: "1",
      countrycodes: "kr", // 한국으로 제한 (검색 정확도 향상)
      addressdetails: "1", // 상세 주소 정보 포함
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          "User-Agent": "WeatherApp/1.0 (Weather forecast application)", // 필수!
          "Accept-Language": "ko", // 한국어 우선
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API 오류: ${response.status}`);
    }

    const data = await response.json();

    console.log("📦 Nominatim 응답:", data);

    // 결과 확인
    if (!data || data.length === 0) {
      throw new Error(`주소를 찾을 수 없습니다: ${address}`);
    }

    const result = data[0];

    const coords = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };

    console.log("✅ Geocoding 성공:", {
      입력주소: address,
      찾은주소: result.display_name,
      좌표: coords,
    });

    return coords;
  } catch (error) {
    console.error("❌ Geocoding 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "위치 정보를 가져오는데 실패했습니다."
    );
  }
}
