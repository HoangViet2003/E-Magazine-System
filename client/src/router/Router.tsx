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
      {
        path: "/dashboard",
        element: <LandingPage />,
      },
      {
        path: "/myFaculty",
        element: <LandingPage />,
      },
      {
        path: "/selectedContribution",
        element: <LandingPage />,
      },
      {
        path: "/recent",
        element: <LandingPage />,
      },
      {
        path: "/starred",
        element: <LandingPage />,
      },
      {
        path: "/trash",
        element: <LandingPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
