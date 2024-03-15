import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/landing_page/LandingPage";
import AppLayOut from "../ui/AppLayOut";
import Dashboard from "../pages/dashboard/Dashboard";
import MyFaculty from "../pages/my_faculty/MyFaculty";

const router = createBrowserRouter([
  {
    element: <AppLayOut />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/myFaculty",
        element: <MyFaculty />,
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
