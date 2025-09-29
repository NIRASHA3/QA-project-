import React, { useEffect, useRef, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';

function Customers() {
    // useRef hook: Creates a reference to a DOM element
    // Although not used in this component, it's typically used for printing functionality
    const componentRef = useRef();
    
    // useState hook: Manages component state
    // billsData: Stores all bills fetched from the API (used to extract customer information)
    const [billsData, setBillsData] = useState([]);
  
    // useDispatch hook: Provides access to the Redux store's dispatch function
    const dispatch = useDispatch();
    
    // Function to fetch all bills from the API
    const getAllBills = () => {
      dispatch({ type: "showLoading" }); // Show global loading indicator
      axios
        .get("/api/bills/get-all-bills")
        .then((response) => {
          dispatch({ type: "hideLoading" }); // Hide global loading indicator
          const data = response.data;
          data.reverse(); // Reverse to show latest bills first
          setBillsData(data); // Store bills in state
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" }); // Hide global loading indicator on error
          console.log(error);
        });
    };

    // Table column definitions for customers
    const columns = [
      {
        title: "Customer",
        dataIndex: "customerName", // Customer name from bill data
      },
      {
        title: "Phone Number",
        dataIndex: "customerPhoneNumber", // Customer phone number from bill data
      },
      {
        title: "Created On",
        dataIndex: "createdAt", // Bill creation date
        render: (value) => <span>{value.toString().substring(0,10)}</span> // Format date to YYYY-MM-DD
      },
    ];
 
    // useEffect hook: Runs after component mounts
    // Purpose: Fetch all bills when the component is first rendered
    useEffect(() => {
      getAllBills();
    }, []); // Empty dependency array ensures this runs only once

    return (
      <DefaultLayout>
        <div className="d-flex justify-content-between">
          <h3>Customers</h3>
        </div>
        {/* Display customer information extracted from bills */}
        <Table columns={columns} dataSource={billsData} bordered />
      </DefaultLayout>
    );
}

export default Customers;