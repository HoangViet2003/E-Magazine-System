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
import StudentHomepage from "../pages/Student_homepage/StudentHomepage";
import SubmissionImage from "../pages/image_collection/ImageCollection";
import SubmissionEmpty from "../pages/my_faculty/submission/SubmissionEmpty";
import CreateAccount from "../pages/admin/CreateAccount";
import ManagerFolder from "../pages/my_faculty/manager_folder/ManagerFolder";
import AccountTable from "../pages/admin/AccountTable";
import FacultyTable from "../pages/admin/FacultyTable";
import CreateFaculty from "../pages/admin/CreateFaculty";
import CreateContribution from "../pages/admin/CreateContribution";

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
        element: <Navigate replace to="/login" />,
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
        path: "/myFaculty/contributions/:contributionId",
        element: <Contribution />,
      },
      {
        path: "/myFaculty/contributions/submission/:submissionId",
        element: <Submission />,
      },
      {
        path: "/myFaculty/contributions/academic-year",
        element: <ManagerFolder />,
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
    element: (
      <ProtectedRoute>
        <AppLayOut />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        path: "/",
        element: <Navigate replace to="/login" />,
      },
      {
        path: "/student",
        element: <StudentHomepage />,
      },
      {
        path: "/student/contributions/:contributionId",
        element: <Contribution />,
      },
      {
        path: "/student/submission/:submissionId",
        element: <Submission />,
      },
      {
        path: "/student/submission",
        element: <Submission />,
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
      {
        path: "/images/:id",
        element: <SubmissionImage />,
      },
      {
        path:"/account/create",
        element:<CreateAccount/>
      },{
        path:"/account",
        element:<AccountTable/>
      },
      {
        path: "/faculty",
        element: <FacultyTable />,
      },
      {
        path: "/faculty/create",
        element: <CreateFaculty />,
      },
      {
        path: "/contribution/create",
        element: <CreateContribution />,
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
