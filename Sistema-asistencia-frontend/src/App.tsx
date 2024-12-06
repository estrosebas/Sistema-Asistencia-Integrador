import LoginComponent from "./Login/LoginComponent";
import Register from "./Register/Register";
import AdminPanel from "./Admin/AdminPanel";
import Home from "./Home/Home";
import UserPanel from "./User/UserPanel";
import ManagerPanel from "./Manager/ManagerPanel";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginComponent />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Admin" element={<AdminPanel />} />
        <Route path="/User" element={<UserPanel />} />
        <Route path="/Manager" element={<ManagerPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
