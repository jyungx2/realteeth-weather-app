import type { SearchContextValue } from "@/widgets/search-overlay/model/type";
import { createContext, useContext } from "react";

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
