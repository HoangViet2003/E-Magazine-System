import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import LandingPage from "../pages/landing_page/LandingPage";
import AppLayOut from "../ui/AppLayOut";
import Dashboard from "../pages/dashboard/Dashboard";
import MyFaculty from "../pages/my_faculty/MyFaculty";
import TextEditor from "../pages/text_editor/TextEditor";
import YearContribute from "../pages/my_faculty/YearContribute";

import { v4 as uuidv4 } from "uuid";
import ImageCollection from "../pages/image_collection/ImageCollection";

const router = createBrowserRouter([
  {
    element: <AppLayOut />,
    children: [
      {
        index: true,
        path: "/",
        element: <Navigate replace to="/dashboard" />,
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
        path: "/myFaculty/folders/:yearContributeId",
        element: <YearContribute />,
      },
      {
        path: "/myFaculty/images/:imagesId",
        element: <ImageCollection />,
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
  {
    path: "/documents",
    element: <Navigate replace to={`${uuidv4()}`} />,
  },
  {
    path: "/documents/:id",
    element: <TextEditor />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
