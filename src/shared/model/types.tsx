// 기본 위치 정보 (검색 결과) -> SearchForm에서 사용
export interface Location {
  id: number;
  name: string;
  city: string;
}

// 좌표 포함 위치 (즐겨찾기 추가 후 geocoding API 호출해 받아옴)
// -> LocationModal, FavoritesPage 등에서 사용
export interface LocationWithCoords extends Location {
  lat: number;
  lng: number;
}
