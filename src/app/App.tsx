import router from "@/app/router/routes";
import { useLocationModal } from "@/widgets/location-modal/model/locationContext";
import LocationModal from "@/widgets/location-modal/ui/location-modal";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";
import SearchForm from "@/widgets/search-overlay/ui/search-form";
import { RouterProvider } from "react-router-dom";

function App() {
  const { isSearchOpen } = useSearch();

  const { isModalOpen } = useLocationModal();

  return (
    <>
      <RouterProvider router={router} />
      {isSearchOpen && <SearchForm />}
      {isModalOpen && <LocationModal />}
    </>
  );
}

export default App;
