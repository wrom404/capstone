import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Fix import
import LoginPage from "../pages/LoginPage";
import Page from "../pages/Page";
import Layout from "../components/Layout";
import CalendarPage from "@/pages/CalendarEventPage";
import EventPage from "@/pages/EventPage";
import ArchivePage from "@/pages/ArchivePage";
import ScheduleEventPage from "@/pages/ScheduleEventPage";
import CurrentEventPage from "@/pages/CurrentEventPage";

const RoutePage = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route (Login Page - No Layout) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private Routes (Wrapped with Layout) */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Page />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/event" element={<EventPage />} />
                <Route path="/event/:id" element={<CurrentEventPage />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/schedule" element={<ScheduleEventPage />} />
                {/* <Route path="/logout" element={} /> */}
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default RoutePage;
