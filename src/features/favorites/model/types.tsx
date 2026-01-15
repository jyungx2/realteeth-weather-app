export interface FavoriteLocation {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

// 즐겨찾기 + 날씨 데이터
export interface FavoriteWithWeather extends FavoriteLocation {
  currentTemp?: number;
  highTemp?: number;
  lowTemp?: number;
  condition?: string;
  isLoading?: boolean;
}
