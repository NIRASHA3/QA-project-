import logo from "./logo.svg";
import "antd/dist/antd.css";
import { Button } from "antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Items from "./pages/Items";
import CartPage from "./pages/CartPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import Bills from "./pages/Bills";
import Categories from "./pages/Categories";
import Overview from "./pages/Overview";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Protected routes - only accessible when logged in */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          } />
          <Route path="/items" element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/bills" element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="/overview" element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          } />
          
          {/* Public routes - accessible without authentication */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Default route - redirect based on authentication status */}
          <Route path="/" element={
            localStorage.getItem('pos-user') ? 
            <Navigate to="/home" replace /> : 
            <Navigate to="/login" replace />
          } />
          
          {/* Catch all route - redirect to appropriate page */}
          <Route path="*" element={
            localStorage.getItem('pos-user') ? 
            <Navigate to="/home" replace /> : 
            <Navigate to="/login" replace />
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// Protected Route Component - prevents unauthorized access to pages
export function ProtectedRoute({ children }) {
  // Check if user is authenticated (exists in localStorage)
  if (localStorage.getItem('pos-user')) {
    return children; // Allow access to the protected component
  } else {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }
}