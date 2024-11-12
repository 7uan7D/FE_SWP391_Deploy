import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Profile from "./pages/profile";
import JoinRide from "./pages/joinRide";
import CreateRide from "./pages/createRide";
import MyRides from "./pages/myRIdes";
import Feedback from "./pages/feedBack";
import ModerateRide from "./pages/moderateRide";
import ModerateFeedback from "./pages/moderateFeedback";
import Chat from "./pages/chat";
import Conversation from "./pages/conversation";
import TopUp from "./pages/topUp";
import SuccessPage from "./pages/successPage";
import FailurePage from "./pages/failurePage";
import AboutUs from "./aboutus";
import RideSchedule from "./pages/rideSchedule";
import Dashboard from "./components/dashboard";
import ManageLocation from "./pages/admin/manage-location";
import ManageTrip from "./pages/admin/manage-trip";
import ManageComplaint from "./pages/admin/manage-complaint";
import ManageUser from "./pages/admin/manage-user";
import ManageStaff from "./pages/admin/manage-staff";
import ForgotPasswordPage from "./pages/forgotPassword";
import Layout from "./Layout";

const PublicRoute = ({ element }) => {
  return element;
};

const checkRole = (role, allowedRoles) => allowedRoles.includes(role);


const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    return checkRole(userRole, allowedRoles) ? element : <Navigate to="/" replace />;
  } catch (error) {
    console.error("Lỗi khi giải mã token:", error);
    return <Navigate to="/login" replace />;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <PublicRoute element={<HomePage />} />,
      },
      {
        path: "login",
        element: <PublicRoute element={<LoginPage />} />,
      },
      {
        path: "register",
        element: <PublicRoute element={<RegisterPage />} />,
      },
      {
        path: "forgot-password",
        element: <PublicRoute element={<ForgotPasswordPage />} />,
      },
      {
        path: "aboutus",
        element: <PublicRoute element={<AboutUs />} />,
      },
      {
        path: "my-rides",
        element: <ProtectedRoute element={<MyRides />} allowedRoles={["STUDENT"]} />,
      },
      {
        path: "create-ride",
        element: <ProtectedRoute element={<CreateRide />} allowedRoles={["STUDENT"]} />,
      },
      {
        path: "join-ride",
        element: <ProtectedRoute element={<JoinRide />} allowedRoles={["STUDENT"]} />,
      },
      {
        path: "feedback/:rideId",
element: <ProtectedRoute element={<Feedback />} allowedRoles={["STUDENT"]} />,
      },
      {
        path: "topup",
        element: <ProtectedRoute element={<TopUp />} allowedRoles={["STUDENT"]} />,
      },
      {
        path: "payment/success",
        element: <ProtectedRoute element={<SuccessPage />} allowedRoles={["STUDENT"]} />,
      },
      {
        path: "payment/failure",
        element: <ProtectedRoute element={<FailurePage />} allowedRoles={["STUDENT"]} />,
      },
      {
        path: "moderate-ride",
        element: <ProtectedRoute element={<ModerateRide />} allowedRoles={["STAFF"]} />,
      },
      {
        path: "moderate-feedback",
        element: <ProtectedRoute element={<ModerateFeedback />} allowedRoles={["STAFF"]} />,
      },
      {
        path: "schedule",
        element: <ProtectedRoute element={<RideSchedule />} allowedRoles={["STAFF"]} />,
      },
      {
        path: "chat",
        element: <ProtectedRoute element={<Chat />} allowedRoles={["STUDENT", "STAFF", "ADMIN"]} />,
      },
      {
        path: "conversation",
        element: <ProtectedRoute element={<Conversation />} allowedRoles={["STUDENT", "STAFF", "ADMIN"]} />,
      },
      {
        path: "profile",
        element: <ProtectedRoute element={<Profile />} allowedRoles={["STUDENT", "STAFF", "ADMIN"]} />,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute element={<Dashboard />} allowedRoles={["ADMIN"]} />,
        children: [
          {
            path: "locations",
            element: <ManageLocation />,
          },
          {
            path: "trip",
            element: <ManageTrip />,
          },
          {
            path: "complaint",
            element: <ManageComplaint />,
          },
          {
            path: "user",
            element: <ManageUser />,
          },
          {
            path: "staff",
            element: <ManageStaff />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;