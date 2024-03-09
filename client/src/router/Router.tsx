import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/landing_page/LandingPage";
import AppLayOut from "../ui/AppLayOut";

const router = createBrowserRouter([
  {
    element: <AppLayOut />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
