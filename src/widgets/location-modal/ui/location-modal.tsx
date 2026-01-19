import { useEffect } from "react";
import { useLocationModal } from "../model/locationContext";
import { X, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";
import { useFavoritesStore } from "@/features/favorites/model/useFavoritesStore";
import toast from "react-hot-toast";
import { useWeatherByCoords } from "@/features/weather/useWeatherByCoords";
import { useGeocodeLocation } from "@/features/geocoding/useGeocodeLocation";

export default function LocationModal() {
  const { selectedLocation, isModalOpen, closeModal } = useLocationModal();
  const { toggleSearch } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite: checkIsFavorite,
  } = useFavoritesStore();

  const isFavorited = selectedLocation
    ? checkIsFavorite(selectedLocation.id)
    : false;

  // 1. 주소 → 좌표 변환 (useQuery)
  const {
    data: coords,
    isLoading: isGeocoding,
    error: geocodeError,
  } = useGeocodeLocation(selectedLocation?.name ?? null);

  // 2. 좌표 → 날씨 데이터 가져오기 (useQuery)
  const {
    data: weatherData,
    isLoading: isLoadingWeather,
    error: weatherError,
  } = useWeatherByCoords(coords);

  const isLoading = isGeocoding || isLoadingWeather;
  const error = geocodeError || weatherError;

  useEffect(() => {
    if (error) {
      // toast.error는 이미 중복 방지 기능 내장
      toast.error("해당 장소의 정보가 제공되지 않습니다.", {
        id: "location-error", // 🎯 같은 ID면 중복 안 뜸
        duration: 3000,
        position: "top-center",
        style: {
          background: "#EF4444",
          color: "#fff",
          padding: "18px",
          borderRadius: "12px",
          fontSize: "14px",
        },
        icon: "⚠️",
      });
      closeModal();
    }
  }, [error, closeModal]);

  // 즐겨찾기 토글
  const handleToggleFavorite = () => {
    if (!selectedLocation || !coords) return;

    if (isFavorited) {
      removeFavorite(selectedLocation.id);
      alert("즐겨찾기에서 제거되었습니다.");
    } else {
      if (favorites.length >= 6) {
        alert("즐겨찾기는 최대 6개까지 추가할 수 있습니다.");
        return;
      }

      const success = addFavorite({
        id: selectedLocation.id,
        name: selectedLocation.name,
        city: selectedLocation.city,
        lat: coords.latitude,
        lng: coords.longitude,
      });

      if (success) {
        alert("즐겨찾기에 추가되었습니다.");
        closeModal(); // 위치 모달 닫기
        toggleSearch(); // 검색 오버레이 닫기

        // 이미 favorites 페이지면 navigate X -> history stack에 중복 추가 방지
        if (location.pathname !== "/favorites") {
          navigate("/favorites");
        }
      } else {
        alert("즐겨찾기 추가에 실패했습니다.");
      }
    }
  };

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
            onClick={handleToggleFavorite}
            className="px-4 py-2 bg-primary hover:bg-white/5 text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label={isFavorited ? "즐겨찾기 제거" : "즐겨찾기 추가"}
          >
            <span>{isFavorited ? "제거" : "추가"}</span>
          </button>
        </header>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-6">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center pt-50">
              <div className="animate-spin rounded-full h-20 w-20 border-2 border-primary border-t-transparent mb-6" />
              <p className="text-grey mt-4 text-[1.8rem]">
                날씨 정보를 불러오고 있어요!
              </p>
            </div>
          )}

          {/* 날씨 데이터 */}
          {weatherData && !isLoading && (
            <div className="space-y-6">
              {/* 현재 날씨 - 메인 카드 */}
              <div className="bg-linear-to-br from-primary/20 to-primary/5 rounded-3xl p-8 text-center border border-primary/10">
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
