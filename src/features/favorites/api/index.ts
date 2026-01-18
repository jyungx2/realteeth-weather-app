// /*
// // ⛔️ useFavoritesStore.ts에서 zustand의 persist 미들웨어를 사용하면서 불필요해진 파일

// // 원래는 localStorage 읽기/쓰기(getItem/setItem)를 여기서 직접 관리했는데, persist를 쓰면 set()만 호출해도 자동으로 localStorage에 저장되고 새로고침할 때도 자동 복원됨. => 이 파일의 getAll(), save() 같은 함수들을 수동으로 호출할 필요가 없어짐.

// // 예를 들어 즐겨찾기 추가할 때 이전엔 add() 호출하고 다시 getAll()로 읽어와서 Zustand 상태를 동기화하는 2단계 필요했는데, 지금은 그냥 set({ favorites: [...favorites, location] }) 한 줄이면 persist가 localStorage 저장까지 다 처리함.

// // 📍 코드만 확인하시려면 해당 파일 전체 선택(cmd+A) 후 cmd+/ 눌러주세요.
// *

// import type { LocationWithCoords } from "@/shared/model/types";

// const STORAGE_KEY = "favoriteLocations";

// export const getAll = (): LocationWithCoords[] => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     return stored ? JSON.parse(stored) : [];
//   } catch (error) {
//     console.error("즐겨찾기 불러오기 실패:", error);
//     return [];
//   }
// };

// export const save = (favorites: LocationWithCoords[]): void => {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
//   } catch (error) {
//     console.error("즐겨찾기 저장 실패:", error);
//   }
// };

// export const add = (location: LocationWithCoords): boolean => {
//   const favorites = getAll();

//   // 6개 제한 체크
//   if (favorites.length >= 6) {
//     return false;
//   }

//   // 중복 체크
//   if (favorites.some((fav) => fav.id === location.id)) {
//     return false;
//   }

//   save([...favorites, location]);
//   return true;
// };

// export const remove = (locationId: number): void => {
//   const favorites = getAll();
//   save(favorites.filter((fav) => fav.id !== locationId));
// };

// export const update = (locationId: number, newName: string): void => {
//   const favorites = getAll();
//   const updated = favorites.map((fav) =>
//     fav.id === locationId ? { ...fav, name: newName } : fav,
//   );
//   save(updated);
// };
