// 즐겨찾기 상태를 로컬 상태가 아닌 전역 상태로 관리해야 하는 이유
// # 문제 상황
// 1. Favorites 페이지에서 LocationModal를 열어 즐겨찾기 추가
// 2. 모달 닫힘(즐겨찾기 페이지는 여전히 마운트 상태)
// 3. useState로는 LocationModal의 업데이트를 Favorites 페이지가 감지 못함

// # 해결 방법
// Zustand의 구독 패턴(한 곳에서 업데이트 -> 구독하는 컴포넌트 모두 리렌더링)으로 같은 페이지 내 실시간 동기화

// * 동작 순서: LocationModal에서 addFavorite() 호출 → Zustand store 업데이트 → 해당 상태 구독하는 Favorites 페이지 자동 리렌더링 → 최신 데이터 즉시 표시
// => localStorage(영속성) + Zustand(실시간 반응성) 동시 관리 가능!

import { create } from "zustand";
import {
  getAll,
  add as addToStorage,
  remove as removeFromStorage,
  update as updateNameInStorage,
} from "../api";
import type { FavoritesStore } from "@/features/favorites/model/types";

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: getAll(), // 초기값

  loadFavorites: () => {
    const favorites = getAll();
    set({ favorites });
  },

  addFavorite: (location) => {
    const success = addToStorage(location); // boolean 반환
    if (success) {
      set({ favorites: getAll() });
    }
    return success;
  },

  removeFavorite: (id) => {
    removeFromStorage(id);
    set({ favorites: getAll() });
  },

  updateFavoriteName: (id, newName) => {
    updateNameInStorage(id, newName); // localStorage 업데이트
    set({ favorites: getAll() }); // Zustand 상태 업데이트
  },

  isFavorite: (id) => {
    return get().favorites.some((fav) => fav.id === id);
  },
}));
