// layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import LocationModal from "@/widgets/location-modal/ui/location-modal";
import SearchForm from "@/widgets/search-overlay/ui/search-form";
import { useLocationModal } from "@/widgets/location-modal/model/locationContext";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";

export default function RootLayout() {
  const { isModalOpen } = useLocationModal();
  const { isSearchOpen } = useSearch();

  return (
    <>
      <Outlet />
      {isSearchOpen && <SearchForm />}
      {isModalOpen && <LocationModal />}
    </>
  );
}
