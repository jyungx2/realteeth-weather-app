import type { LocationWithCoords } from "@/shared/model/types";

// 즐겨찾기 + 날씨 데이터
export interface FavoriteWithWeather extends LocationWithCoords {
  currentTemp?: number;
  highTemp?: number;
  lowTemp?: number;
  condition?: string;
  hourlyForecast?: Array<{
    time: string;
    temp: number;
    icon: string;
  }>;
  isLoading?: boolean;
}

//  * 데이터 분리 원칙:
//  - localStorage + Zustand: 영속적 데이터 (id, name, city, lat, lng)
//  - 페이지 로컬 상태: 일시적 데이터 (currentTemp, condition 등) => 날씨는 계속 변하므로 페이지 열 때마다 API로 새로 가져옴
export interface FavoritesStore {
  favorites: LocationWithCoords[]; // 실시간 날씨데이터는 포함하지 않는 위치+좌표 데이터 (localStorage와 동기화)

  // Zustand Actions
  addFavorite: (location: LocationWithCoords) => boolean;
  removeFavorite: (id: number) => void;
  updateFavoriteName: (id: number, newName: string) => void;
  isFavorite: (id: number) => boolean;
}
