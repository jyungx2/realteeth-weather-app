const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Kakao Local API를 사용한 한국 주소 geocoding
 * OpenWeather는 도시 레벨만 지원하므로 Kakao 사용 필수!
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
      coords: { lat: result.y, lon: result.x },
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
