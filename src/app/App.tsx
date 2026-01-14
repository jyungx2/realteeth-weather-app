import router from "@/app/router/routes";
import { useSearch } from "@/widgets/search-overlay/model/searchContext";
import SearchForm from "@/widgets/search-overlay/ui/search-form";
import { RouterProvider } from "react-router-dom";

function App() {
  const { isSearchOpen, toggleSearch } = useSearch();

  return (
    <>
      <RouterProvider router={router} />
      {isSearchOpen && <SearchForm onClose={toggleSearch} />}
    </>
  );
}

export default App;
