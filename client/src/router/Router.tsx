import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/landing_page/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
