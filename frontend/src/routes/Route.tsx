import { BrowserRouter as Router, Routes, Route } from "react-router";
import LoginPage from "../pages/LoginPage";

const RoutePage = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default RoutePage;
