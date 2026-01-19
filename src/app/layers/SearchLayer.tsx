import SearchForm from "@/widgets/search-overlay/ui/search-form";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";

export function SearchLayer() {
  const { isSearchOpen } = useSearch();
  if (!isSearchOpen) return null;
  return <SearchForm />;
}
