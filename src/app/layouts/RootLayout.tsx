import { Outlet } from "react-router-dom";
import { SearchLayer } from "@/app/layers/SearchLayer";
import { LocationLayer } from "@/app/layers/LocationLayer";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <SearchLayer />
      <LocationLayer />
    </>
  );
}
