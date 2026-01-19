import type { Coordinates } from "@/shared/model/location";

// 현재 위치 가져오기 (재시도 로직 추가)
export const getCurrentPosition = (
  maxRetries = 2,
  retryDelay = 1500,
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
          // 최대 재시도 횟수 초과 또는 다른 에러
          let errorMessage = "위치 정보를 가져올 수 없습니다.";

          switch (error.code) {
            case 1: // PERMISSION_DENIED - 상황: 사용자가 위치 권한을 거부함
              // - 브라우저 팝업에서 "차단" 클릭
              // - 브라우저 설정에서 위치 권한 차단됨
              // - HTTPS가 아닌 HTTP에서 접속 (보안상 차단)

              // 재시도 의미 X -> 바로 에러메시지 출력
              errorMessage =
                "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.";
              reject(new Error(errorMessage));
              return;

            case 2: // POSITION_UNAVAILABLE - 상황: GPS/네트워크 위치 서비스를 사용할 수 없음
              // - GPS 신호 약함 (건물 안, 지하, 터널)
              // - Wi-Fi/셀룰러 위치 서비스 일시적 오류
              // - 위치 제공자가 응답 안 함
              errorMessage =
                "위치 정보를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.";
              break; // 재시도 로직으로 이동

            case 3: // TIMEOUT - 상황: 지정된 시간 내에 위치를 가져오지 못함
              // - GPS가 위성 신호 찾는 중 (초기화)
              // - 네트워크 느림
              // - timeout 옵션 시간 내에 못 가져옴
              errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
              break; // 재시도 로직으로 이동

            default:
              errorMessage = "알 수 없는 오류가 발생했습니다.";
              break;
          }
          // >> code 2, 3만 여기 도달 (재시도 필요한 상황의 에러 처리)
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(
              `위치 정보 가져오기 재시도 중... (${retryCount}/${maxRetries})`,
            );
            setTimeout(attemptGetPosition, retryDelay);
          } else {
            // 최대 재시도 횟수 초과
            reject(new Error(errorMessage));
          }
        },
        {
          enableHighAccuracy: false, // GPS 칩이 아닌 네트워크 기반 위치 사용 -> 배터리 절약 및 속도 향상
          timeout: 10000, // 5초 → 10초로 증가
          maximumAge: 300000, // 0 → 5분으로 변경 (캐시된 위치도 허용)
        },
      );
    };

    attemptGetPosition();
  });
};
