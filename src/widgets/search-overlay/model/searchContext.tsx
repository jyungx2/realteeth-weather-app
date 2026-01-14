import { createContext, useContext } from "react";

// Context에서 제공할 값의 타입 정의
type SearchContextValue = {
  isSearchOpen: boolean;
  toggleSearch: () => void;
};

// Context 생성 (초기값은 undefined 권장)
export const SearchContext = createContext<SearchContextValue | undefined>(
  undefined
);

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);

  if (!ctx) {
    throw new Error("useSearch must be used within <SearchProvider>");
  }

  return ctx;
}
