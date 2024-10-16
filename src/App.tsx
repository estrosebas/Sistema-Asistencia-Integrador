import LoginComponent from "./Login/LoginComponent";
import Register from "./Register/Register";
import AdminPanel from "./Admin/AdminPanel";
import Home from "./Home/Home";
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
      </Routes>
    </Router>
  );
}

export default App;
