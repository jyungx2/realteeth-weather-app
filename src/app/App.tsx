import router from "@/app/router/routes";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            zIndex: 9999, // 이거 추가!
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
