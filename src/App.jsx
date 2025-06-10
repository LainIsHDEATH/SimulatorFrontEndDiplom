import {Routes, Route} from "react-router-dom";
import RegisterPage from "./components/auth/RegisterPage";
import Dashboard from "./components/dashboard/Dashboard";

// --- Main App ---

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  );
}

