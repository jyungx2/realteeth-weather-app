// features/favorites/model/useFavoritesStore.ts
import { create } from "zustand";
import {
  getAll,
  add as addToStorage,
  remove as removeFromStorage,
} from "../api";
import type { FavoritesStore } from "@/features/favorites/model/types";

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: getAll(), // 초기값

  loadFavorites: () => {
    const favorites = getAll();
    set({ favorites });
  },

  addFavorite: (location) => {
    addToStorage(location);
    set({ favorites: getAll() });
  },

  removeFavorite: (id) => {
    removeFromStorage(id);
    set({ favorites: getAll() });
  },

  isFavorite: (id) => {
    return get().favorites.some((fav) => fav.id === id);
  },
}));
