import { createBrowserRouter, Navigate } from "react-router";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import BatchManagement from "./pages/admin/BatchManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import MediaManager from "./pages/admin/MediaManager";
import TestManagement from "./pages/admin/TestManagement";
import StudentDashboard from "./pages/student/Dashboard";
import MediaLibrary from "./pages/student/MediaLibrary";
import TestSchedule from "./pages/student/TestSchedule";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "batches", element: <BatchManagement /> },
      { path: "students", element: <StudentManagement /> },
      { path: "media", element: <MediaManager /> },
      { path: "tests", element: <TestManagement /> },
    ],
  },
  {
    path: "/student",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: "media", element: <MediaLibrary /> },
      { path: "tests", element: <TestSchedule /> },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
