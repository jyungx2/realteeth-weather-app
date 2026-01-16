import type { LocationWithCoords } from "@/shared/model/types";

const STORAGE_KEY = "favoriteLocations";

export const getAll = (): LocationWithCoords[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("즐겨찾기 불러오기 실패:", error);
    return [];
  }
};

export const save = (favorites: LocationWithCoords[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("즐겨찾기 저장 실패:", error);
  }
};

export const add = (location: LocationWithCoords): boolean => {
  const favorites = getAll();

  // 6개 제한 체크
  if (favorites.length >= 6) {
    return false;
  }

  // 중복 체크
  if (favorites.some((fav) => fav.id === location.id)) {
    return false;
  }

  save([...favorites, location]);
  return true;
};

export const remove = (locationId: number): void => {
  const favorites = getAll();
  save(favorites.filter((fav) => fav.id !== locationId));
};

export const update = (locationId: number, newName: string): void => {
  const favorites = getAll();
  const updated = favorites.map((fav) =>
    fav.id === locationId ? { ...fav, name: newName } : fav
  );
  save(updated);
};
