export interface SelectedLocation {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

// Context에서 제공할 값의 타입 정의
export type SearchContextValue = {
  isSearchOpen: boolean;
  toggleSearch: () => void;
};

////////////////////////////////////////////////
export interface ParsedLocation {
  id: number;
  displayName: string;
  city: string; // 시/도 (예: "서울특별시")
  district?: string; // 구/군 (예: "종로구")
  dong?: string; // 동/읍/면 (예: "청운동")
}

export function parseLocationString(
  location: string,
  index: number
): ParsedLocation {
  const parts = location.split("-");

  return {
    id: index,
    displayName: parts.join(" "),
    city: parts[0] || "",
    district: parts[1],
    dong: parts[2],
  };
}
