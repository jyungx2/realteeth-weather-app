// 리팩토링: persist 사용 (features/favorites/api.tsx 삭제)
// >> BEFORE (수동 관리):
//  1. api.ts에서 localStorage 읽기/쓰기(localStorage.setItem, localStorage.getItem)
//  2. useFavoritesStore에서 api 호출
//  3. set()으로 Zustand 상태 수동 동기화
//
// >> AFTER (자동 관리):
//  1. perist의 set()만 호출하면 persist가 자동으로 localStorage 저장
//  2. 새로고침 시 persist가 자동으로 localStorage에서 복원 => api.tsx 불필요!

import type { FavoritesStore } from "@/features/favorites/model/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      // * BEFORE: add() + set({ favorites: getAll() })
      // * AFTER: set()만 호출! persist가 자동으로 localStorage 저장
      addFavorite: (location) => {
        const { favorites } = get();

        // 6개 제한 체크
        if (favorites.length >= 6) {
          return false;
        }

        // 중복 체크
        if (favorites.some((fav) => fav.id === location.id)) {
          return false;
        }

        // 기존 api 로직(features/favorites/api)은 zustand의 set()로만 처리 가능!
        // => persist가 자동으로 localStorage 저장 & 구독 컴포넌트 리렌더링
        set({ favorites: [...favorites, location] });
        return true;
      },

      // *BEFORE: remove(id) + set({ favorites: getAll() })
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }));
      },

      // * BEFORE: update() + set({ favorites: getAll() })
      updateFavoriteName: (id, newName) => {
        set((state) => ({
          favorites: state.favorites.map((fav) =>
            fav.id === id ? { ...fav, name: newName } : fav,
          ),
        }));
      },

      // 즐겨찾기 여부 확인 (변경 없음)
      isFavorite: (id) => {
        return get().favorites.some((fav) => fav.id === id);
      },
    }),
    {
      name: "favoriteLocations",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// 리팩토링 이전 코드
// export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
//   favorites: getAll(), // 초기값

//   loadFavorites: () => {
//     const favorites = getAll();
//     set({ favorites });
//   },

//   addFavorite: (location) => {
//     const success = addToStorage(location); // boolean 반환
//     if (success) {
//       set({ favorites: getAll() });
//     }
//     return success;
//   },

//   removeFavorite: (id) => {
//     removeFromStorage(id);
//     set({ favorites: getAll() });
//   },

//   updateFavoriteName: (id, newName) => {
//     updateNameInStorage(id, newName); // localStorage 업데이트
//     set({ favorites: getAll() }); // Zustand 상태 업데이트
//   },

//   isFavorite: (id) => {
//     return get().favorites.some((fav) => fav.id === id);
//   },
// }));
