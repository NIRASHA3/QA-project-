import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import "../resourses/layout.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DashboardOutlined } from "@ant-design/icons";

// Destructure Layout components from Ant Design
const { Header, Sider, Content } = Layout;

const DefaultLayout = (props) => {
  // useState hook: Manages the collapsed state of the sidebar
  // collapsed: Boolean that determines if the sidebar is collapsed (true) or expanded (false)
  const [collapsed, setCollapsed] = useState(false);
  
  // useSelector hook: Extracts data from the Redux store state
  // cartItems: Gets the cart items array from the Redux store
  // loading: Gets the loading state from the Redux store (shows/hides the spinner)
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  
  // useNavigate hook: Provides navigation function for programmatic routing
  const navigate = useNavigate();
  
  // Function to toggle the sidebar collapsed state
  const toggle = () => {
    setCollapsed(!collapsed); // Toggle between true and false
  };

  // useEffect hook: Runs after component mounts and when cartItems change
  // Purpose: Persist cart items to localStorage whenever they change
  // This ensures cart data survives browser refreshes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]); // Dependency array - effect runs when cartItems changes

  return (
    <Layout>
      {/* Loading spinner overlay - shows when global loading state is true */}
      {loading && (
        <div className="spinner">
          <div
            className="spinner-border"  // Bootstrap spinner class
            role="status"
          >
          </div>
        </div>
      )}
      
      {/* Sidebar component */}
      <Sider 
        trigger={null}         // Remove default trigger (we're using our own)
        collapsible            // Make sidebar collapsible
        collapsed={collapsed}  // Control collapsed state
      >
        <div className="logo">
          {/* Show abbreviated logo when collapsed, full name when expanded */}
          <h3>{collapsed ? 'POS' : 'AURAPOS'}</h3>
        </div>
        
        {/* Navigation menu */}
        <Menu
          theme="dark"         // Dark theme for the menu
          mode="inline"        // Vertical menu layout
          defaultSelectedKeys={window.location.pathname} // Highlight current route
        >
          {/* Home menu item */}
          <Menu.Item key="/home" icon={<HomeOutlined />}>
            <Link to="/home">Home</Link>
          </Menu.Item>
          
          {/* Categories menu item */}
          <Menu.Item key="/categories" icon={<AppstoreOutlined />}>
            <Link to="/categories">Categories</Link>
          </Menu.Item>
          
          {/* Items menu item */}
          <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
            <Link to="/items">Items</Link>
          </Menu.Item>
          
          {/* Cart menu item - shows shopping cart icon */}
          <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
            <Link to="/cart">Cart</Link>
          </Menu.Item>
          
          {/* Bills menu item - shows copy/document icon */}
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills">Bills</Link>
          </Menu.Item>
          
          {/* Customers menu item - shows user icon */}
          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/customers">Customers</Link>
          </Menu.Item>
          
          {/* Overview/Dashboard menu item */}
          <Menu.Item key="/overview" icon={<DashboardOutlined />}>
            <Link to="/overview">Overview</Link>
          </Menu.Item>
          
          {/* Logout menu item - removes user data and redirects to login */}
          <Menu.Item 
            key="/logout" 
            icon={<LoginOutlined />} 
            onClick={() => {
              localStorage.removeItem('pos-user'); // Clear user data
              navigate('/login');                 // Redirect to login page
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      
      {/* Main content area */}
      <Layout className="site-layout">
        {/* Header section with toggle button and cart indicator */}
        <Header className="site-layout-background" style={{ padding: 10 }}>
          {/* Dynamic icon that changes based on collapsed state */}
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle, // Toggle sidebar when clicked
            }
          )}
          
          {/* Cart counter - shows number of items and navigates to cart on click */}
          <div
            className="cart-count d-flex align-items-center"
            onClick={() => navigate("/cart")} // Navigate to cart page on click
          >
            <b>
              {" "}
              {/* Display cart items count */}
              <p className="mt-3 mr-2">{cartItems.length}</p>
            </b>
            <ShoppingCartOutlined /> {/* Shopping cart icon */}
          </div>
        </Header>
        
        {/* Main content area where child components are rendered */}
        <Content
          className="site-layout-background"
          style={{
            margin: "10px",
            padding: 24,
            minHeight: '80vh' // Minimum height to fill most of the viewport
          }}
        >
          {/* Render child components passed to this layout */}
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;