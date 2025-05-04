import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Fix import
import LoginPage from "../pages/auth/LoginPage";
import Page from "../pages/events/Page";
import Layout from "../components/Layout";
import CalendarPage from "@/pages/events/CalendarEventPage";
import EventPage from "@/pages/events/EventPage";
import ArchivePage from "@/pages/events/ArchivePage";
import ScheduleEventPage from "@/pages/events/ScheduleEventPage";
import EventDetailPage from "@/pages/events/EventDetailPage";
import EditEventPage from "@/pages/events/EditEventPage";
import PageNotFound from "@/pages/error/PageNotFound";
import LogOut from "@/pages/auth/LogOut";
import AdminPrivateRoute from "./AdminPrivateRoute";
import ProtectedRoute from "./ProtectedRoute";
import User from "@/pages/user/User";
import Signup from "@/pages/auth/SignUp";
import { roles as adminRoles } from "@/constant/constant";

const RoutePage = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route (Login Page - No Layout) */}
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<Signup />} />

        {/* Private Routes (Wrapped with Layout) */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Page />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <CalendarPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/event"
                  element={
                    <ProtectedRoute>
                      <EventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-event/:id"
                  element={
                    <ProtectedRoute>
                      <EditEventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/event/:id"
                  element={
                    <ProtectedRoute>
                      <EventDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/archive" element={<ArchivePage />} />
                <Route
                  path="/schedule"
                  element={
                    <AdminPrivateRoute
                      roles={adminRoles}
                    >
                      <ScheduleEventPage />
                    </AdminPrivateRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <AdminPrivateRoute
                      roles={adminRoles}
                    >
                      <User />
                    </AdminPrivateRoute>
                  }
                />
                <Route path="/logout" element={<LogOut />} />
                <Route path="*" element={<PageNotFound />} />
                <Route
                  path="/unauthorized"
                  element={
                    <div className="min-h-screen h-screen flex justify-center items-center text-gray-800 bg-white text-2xl">
                      Unauthorized User
                    </div>
                  }
                />
                {/* Don't add 404 inside Layout */}
              </Routes>
            </Layout>
          }
        />

        {/* Catch-All 404 Page (Standalone) */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default RoutePage;
