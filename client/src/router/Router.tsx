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
import Login from "../pages/login/LoginForm";
import ProtectedRoute from "../ui/ProtectedRoute";
import Submission from "../pages/my_faculty/submission/Submission";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentHomepage from "../pages/Student_homepage/StudentHomepage";

const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={1}
        />{" "}
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
        path: "/myFaculty/contributions/:contributeId",
        element: <Contribution />,
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
  {
    element: (
      <ProtectedRoute>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={1}
        />{" "}
        <AppLayOut />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        path: "/",
        element: <Navigate replace to="/student" />,
      },
      {
        path: "/student",
        element: <StudentHomepage />,
      },
      {
        path: "/selectedSubmission",
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
