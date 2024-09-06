import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminDashboard from './AdminDashboard';
import RegisterUser from './RegisterUser';
import OrderManagement from './OrderManagement';
import AddMenuItem from './AddMenuItem'; 
import Login from './Login'; 
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/registerUser" element={<RegisterUser />} />
        <Route path="/admin/add-menu-item" element={<AddMenuItem />} />
        <Route path="/orders" element={<OrderManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
