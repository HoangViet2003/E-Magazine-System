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
import Contribution from "../pages/my_faculty/contribution/Contribution";

import { v4 as uuidv4 } from "uuid";
import ImageCollection from "../pages/image_collection/ImageCollection";
import Login from "../pages/login/LoginForm";
import ProtectedRoute from "../ui/ProtectedRoute";
import Submission from "../pages/my_faculty/submission/Submission";

const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <AppLayOut />
      </ProtectedRoute>
    ),
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
        path: "/myFaculty/contributions/:yearContributeId",
        element: <Contribution />,
      },
      {
        path: "/myFaculty/images/:imagesId",
        element: <ImageCollection />,
      },
      {
        path: "/myFaculty/contributions/submission/:submissionId",
        element: <Submission />,
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
  {
    path: "/login",
    element: <Login />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
