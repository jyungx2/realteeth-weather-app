// layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { SearchLayer } from "@/app/layers/SearchLayer";
import { LocationLayer } from "@/app/layers/LocationLayer";

export default function RootLayout() {
  // const { isModalOpen } = useLocationModal();
  // const { isSearchOpen } = useSearch();

  return (
    <>
      <Outlet />
      <SearchLayer />
      <LocationLayer />
    </>
  );
}
