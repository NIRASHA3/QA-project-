import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Row, Col, Card, Table, Progress, Statistic, message } from "antd";
import {
  ShoppingOutlined,
  AppstoreOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import "../resourses/overview.css";

function Overview() {
  // useState hook: Manages component state
  // loading: Tracks whether data is still being loaded
  const [loading, setLoading] = useState(true);
  // billsData: Stores all bills fetched from the API
  const [billsData, setBillsData] = useState([]);
  // itemsData: Stores all items fetched from the API
  const [itemsData, setItemsData] = useState([]);
  // categoriesData: Stores all categories fetched from the API
  const [categoriesData, setCategoriesData] = useState([]);
  // analytics: Stores calculated analytics data derived from bills, items, and categories
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    topSellingProducts: [],
    leastSellingProducts: [],
    categoryWiseSales: [],
    recentOrders: []
  });
  
  // useDispatch hook: Provides access to the Redux store's dispatch function
  const dispatch = useDispatch();

  // Async function to fetch all required data
  const getAllData = async () => {
    dispatch({ type: "showLoading" }); // Show global loading indicator
    try {
      // Use Promise.all to fetch all data in parallel for better performance
      const [billsResponse, itemsResponse, categoriesResponse] = await Promise.all([
        axios.get("/api/bills/get-all-bills"),
        axios.get("/api/items/get-all-items"),
        axios.get("/api/categories/get-all-categories")
      ]);

      setBillsData(billsResponse.data);
      setItemsData(itemsResponse.data);
      setCategoriesData(categoriesResponse.data);
      // Calculate analytics from the fetched data
      calculateAnalytics(billsResponse.data, itemsResponse.data, categoriesResponse.data);
      
    } catch (error) {
      message.error("Failed to load analytics data");
      console.error(error);
    } finally {
      dispatch({ type: "hideLoading" }); // Hide global loading indicator
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  // Function to calculate various analytics from the raw data
  const calculateAnalytics = (bills, items, categories) => {
    // Calculate total sales and orders
    const totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalOrders = bills.length;

    // Calculate product sales and category sales using objects as lookup tables
    const productSales = {};
    const categorySales = {};

    bills.forEach(bill => {
      bill.cartItems.forEach(item => {
        // Product-wise sales tracking
        if (!productSales[item.name]) {
          productSales[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
            category: item.category
          };
        }
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;

        // Category-wise sales tracking
        if (!categorySales[item.category]) {
          categorySales[item.category] = {
            name: item.category,
            quantity: 0,
            revenue: 0
          };
        }
        categorySales[item.category].quantity += item.quantity;
        categorySales[item.category].revenue += item.price * item.quantity;
      });
    });

    // Convert objects to arrays and sort for display
    const productsArray = Object.values(productSales);
    const topSellingProducts = [...productsArray]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5); // Get top 5 selling products

    const leastSellingProducts = [...productsArray]
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5); // Get bottom 5 selling products

    const categoryWiseSales = Object.values(categorySales)
      .sort((a, b) => b.revenue - a.revenue); // Sort categories by revenue

    // Get recent orders (last 5)
    const recentOrders = bills
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date descending
      .slice(0, 5); // Get 5 most recent orders

    // Update analytics state with calculated values
    setAnalytics({
      totalSales,
      totalOrders,
      topSellingProducts,
      leastSellingProducts,
      categoryWiseSales,
      recentOrders
    });
  };

  // useEffect hook: Runs after component mounts
  // Purpose: Fetch all data when the component is first rendered
  useEffect(() => {
    getAllData();
  }, []); // Empty dependency array ensures this runs only once

  // Table column definitions for products
  const productColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Quantity Sold',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => quantity.toLocaleString(), // Format number with commas
      sorter: (a, b) => a.quantity - b.quantity, // Enable sorting by quantity
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `$${revenue.toLocaleString()}`, // Format as currency
      sorter: (a, b) => a.revenue - b.revenue, // Enable sorting by revenue
    }
  ];

  // Table column definitions for categories
  const categoryColumns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Total Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `$${revenue.toLocaleString()}`, // Format as currency
      sorter: (a, b) => a.revenue - b.revenue, // Enable sorting by revenue
    },
    {
      title: 'Total Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => quantity.toLocaleString(), // Format number with commas
      sorter: (a, b) => a.quantity - b.quantity, // Enable sorting by quantity
    }
  ];

  // Table column definitions for recent orders
  const recentOrdersColumns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Phone',
      dataIndex: 'customerPhoneNumber',
      key: 'customerPhoneNumber',
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${amount}`, // Format as currency
      sorter: (a, b) => a.totalAmount - b.totalAmount, // Enable sorting by amount
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMode',
      key: 'paymentMode',
      render: (mode) => mode.charAt(0).toUpperCase() + mode.slice(1), // Capitalize first letter
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(), // Format date
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Enable sorting by date
    }
  ];

  // Show loading state while data is being fetched
  if (loading) {
    return <DefaultLayout>Loading analytics...</DefaultLayout>;
  }

  return (
    <DefaultLayout>
      <div className="overview-container">
        <h2>Overview</h2>
        
        {/* Summary Cards */}
        <Row gutter={16} className="summary-cards">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Sales"
                value={analytics.totalSales}
                prefix="$"
                valueStyle={{ color: '#3f8600' }}
                suffix={<RiseOutlined />} // Green upward arrow indicating growth
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={analytics.totalOrders}
                prefix={<ShoppingOutlined />} // Shopping cart icon
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Top Categories"
                value={analytics.categoryWiseSales.length}
                prefix={<AppstoreOutlined />} // App store icon
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Products Tracked"
                value={itemsData.length}
                prefix={<BarChartOutlined />} // Bar chart icon
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={16} className="overview-content">
          {/* Top Selling Products */}
          <Col span={12}>
            <Card title="Top 5 Selling Products" className="chart-card">
              <Table
                dataSource={analytics.topSellingProducts}
                columns={productColumns}
                pagination={false}
                size="small"
                rowKey="name"
              />
            </Card>
          </Col>

          {/* Least Selling Products */}
          <Col span={12}>
            <Card title="Least Selling Products" className="chart-card">
              <Table
                dataSource={analytics.leastSellingProducts}
                columns={productColumns}
                pagination={false}
                size="small"
                rowKey="name"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="overview-content">
          {/* Category-wise Sales */}
          <Col span={12}>
            <Card title="Category-wise Sales Performance" className="chart-card">
              <Table
                dataSource={analytics.categoryWiseSales}
                columns={categoryColumns}
                pagination={false}
                size="small"
                rowKey="name"
              />
            </Card>
          </Col>

          {/* Recent Orders */}
          <Col span={12}>
            <Card title="Recent Orders" className="chart-card">
              <Table
                dataSource={analytics.recentOrders}
                columns={recentOrdersColumns}
                pagination={false}
                size="small"
                rowKey="_id"
              />
            </Card>
          </Col>
        </Row>

        {/* Sales Distribution Chart */}
        {analytics.totalSales > 0 && (
          <Row className="overview-content">
            <Col span={24}>
              <Card title="Sales Distribution by Category" className="chart-card">
                <div className="category-progress">
                  {analytics.categoryWiseSales.map(category => (
                    <div key={category.name} className="progress-item">
                      <div className="progress-label">
                        <span>{category.name}</span>
                        <span>${category.revenue.toLocaleString()}</span>
                      </div>
                      <Progress
                        percent={Math.round((category.revenue / analytics.totalSales) * 100)}
                        status="active"
                        strokeColor={{
                          from: '#108ee9',
                          to: '#87d068',
                        }} // Gradient progress bar
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </DefaultLayout>
  );
}

export default Overview;