const KAKAO_API_KEY =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_KAKAO_PROD_API_KEY // 실제 앱 키
    : import.meta.env.VITE_KAKAO_TEST_API_KEY; // 테스트 앱 키

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Kakao Local API를 사용한 한국 주소 geocoding(주소 -> 좌표 변환)
 * OpenWeather는 도시 레벨만 지원하므로 Kakao 사용 필수!

EX) OpenWeather: 구/동이 달라도 모두 같은 "서울" 좌표 반환 ❌
 - "서울특별시 종로구 청와대로 1" → OpenWeather: 서울 (37.5665, 126.9780)
 - "서울특별시 강남구 테헤란로 152" → OpenWeather: 서울 (37.5665, 126.9780)


EX) Kakao Local API: 상세 주소까지 정확한 좌표 제공 ✅
 - "서울특별시 종로구 청와대로 1" → (37.5867, 126.9748)
 - "서울특별시 강남구 테헤란로 152" → (37.5048, 127.0493)
 */
export async function geocodeLocation(address: string): Promise<Coordinates> {
  try {
    // API 키 확인
    if (!KAKAO_API_KEY) {
      throw new Error(
        "카카오 API 키가 설정되지 않았습니다. .env 파일을 확인하세요."
      );
    }

    console.log("🔍 API Key loaded:", KAKAO_API_KEY ? "✅ 있음" : "❌ 없음");

    // 하이픈이나 공백 정리
    const query = address.replace(/-/g, " ").trim();

    console.log("🔍 Kakao Geocoding:", query);

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📡 Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Kakao API Error Response:", errorData);
      throw new Error(`Kakao API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log("📡 Kakao API Response Data:", data);

    if (!data.documents || data.documents.length === 0) {
      throw new Error(`주소를 찾을 수 없습니다: ${address}`);
    }

    const result = data.documents[0];

    console.log("✅ Kakao Result:", {
      address: result.address_name,
      coords: { lat: result.y, lng: result.x },
    });

    return {
      latitude: parseFloat(result.y),
      longitude: parseFloat(result.x),
    };
  } catch (error) {
    console.error("❌ Kakao Geocoding error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "위치 정보를 가져오는데 실패했습니다."
    );
  }
}
