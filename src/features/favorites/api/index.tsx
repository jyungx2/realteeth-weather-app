import type { FavoriteLocation } from "@/features/favorites/model/types";

const STORAGE_KEY = "favoriteLocations";

export const getAll = (): FavoriteLocation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("즐겨찾기 불러오기 실패:", error);
    return [];
  }
};

export const save = (favorites: FavoriteLocation[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("즐겨찾기 저장 실패:", error);
  }
};

export const add = (location: FavoriteLocation): void => {
  const favorites = getAll();
  if (!favorites.some((fav) => fav.id === location.id)) {
    save([...favorites, location]);
  }
};

export const remove = (locationId: number): void => {
  const favorites = getAll();
  save(favorites.filter((fav) => fav.id !== locationId));
};
