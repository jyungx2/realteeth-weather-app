import RootLayout from "@/app/layouts/RootLayout";
import Detail from "@/pages/detail";
import Favorites from "@/pages/favorites";
import Home from "@/pages/home";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/detail", element: <Detail /> },
      { path: "/favorites", element: <Favorites /> },
    ],
  },
]);
export default router;
