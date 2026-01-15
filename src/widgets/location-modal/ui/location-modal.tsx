// widgets/location-modal/ui/LocationModal.tsx
import { useEffect, useState } from "react";
import { useLocationModal } from "../model/locationContext";
import { fetchWeatherData } from "@/shared/api/weather";
import type { WeatherData } from "@/shared/model/weather";
import { geocodeLocation } from "@/shared/api/geocoding";
import { X, MapPin } from "lucide-react";

export default function LocationModal() {
  const { selectedLocation, isModalOpen, closeModal } = useLocationModal();

  // Modal 내부에서 날씨 데이터 관리
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // selectedLocation이 변경되면 날씨 데이터 가져오기
  useEffect(() => {
    if (!selectedLocation) return;

    const loadWeatherData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("1. Geocoding location:", selectedLocation.name);
        const coords = await geocodeLocation(selectedLocation.name);

        const weather = await fetchWeatherData(coords);
        console.log("3. Weather:", weather);

        setWeatherData(weather);
      } catch (err) {
        console.error("Failed to load weather:", err);
        setError("날씨 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadWeatherData();
  }, [selectedLocation]);

  // 모달이 열려있지 않으면 렌더링 안 함
  if (!isModalOpen || !selectedLocation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
        aria-label="배경 클릭하여 닫기"
      />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full bg-dark-card rounded-t-[20px] animate-slide-up min-h-[55vh] flex flex-col shadow-2xl">
        {/* 헤더 - 고정 */}
        <header className="flex items-center justify-between px-5 py-6 border-b border-dark-border/50 shrink-0">
          <button
            onClick={closeModal}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            aria-label="닫기"
          >
            <X size={22} className="text-grey cursor-pointer" />
          </button>

          <h1 className="font-semibold text-white">날씨 정보</h1>

          <button
            className="px-4 py-2 bg-primary hover:bg-white/5 text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="즐겨찾기 추가"
          >
            <span>추가</span>
          </button>
        </header>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-6">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center pt-50">
              <div className="animate-spin rounded-full h-20 w-20 border-2 border-primary border-t-transparent mb-6" />
              <p className="text-grey mt-4 text-[1.8rem]">
                날씨 정보를 불러오는 중...
              </p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && !isLoading && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* 날씨 데이터 */}
          {weatherData && !isLoading && (
            <div className="space-y-6">
              {/* 현재 날씨 - 메인 카드 */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 text-center border border-primary/10">
                <div className="flex flex-col items-center gap-4">
                  {/* 위치 정보 */}
                  <div className="flex items-center justify-center gap-2 text-grey">
                    <MapPin size={16} className="shrink-0" />
                    <p className="font-medium">{selectedLocation.name}</p>
                  </div>

                  {/* 현재 온도 */}
                  <div className="text-6xl font-bold text-white tracking-tight">
                    {weatherData.currentTemp}°
                  </div>
                  {/* 날씨 설명 */}
                  <p className="text-lg text-grey font-medium">
                    {weatherData.condition}
                  </p>
                  {/* 최고/최저 온도 */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-grey">최고</span>
                      <span className="text-white font-semibold">
                        {weatherData.highTemp}°
                      </span>
                    </div>
                    <div className="w-px h-4 bg-grey/30" />
                    <div className="flex items-center gap-1">
                      <span className="text-grey">최저</span>
                      <span className="text-white font-semibold">
                        {weatherData.lowTemp}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 시간별 예보 */}
              <div className="bg-dark-overlay rounded-2xl p-5 border border-dark-border/30">
                <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  시간별 예보
                </h3>

                {/* 가로 스크롤 영역 */}
                <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                  {weatherData.hourlyForecast.map((hour, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 min-w-[64px] py-3 px-2 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      {/* 시간 */}
                      <p className="text-grey text-xs font-medium whitespace-nowrap">
                        {hour.time}
                      </p>

                      {/* 날씨 아이콘 */}
                      <div className="text-3xl my-1">{hour.icon}</div>

                      {/* 온도 */}
                      <p className="text-white font-bold">{hour.temp}°</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
