import { SearchContext } from "@/widgets/search-overlay/model/searchContext";
import { useState, useMemo, useCallback, type ReactNode } from "react";

// Provider props 타입
type SearchProviderProps = {
  children: ReactNode;
};

export function SearchProvider({ children }: SearchProviderProps) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const value = useMemo(
    () => ({
      isSearchOpen: open,
      toggleSearch: toggle,
    }),
    [open, toggle]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
