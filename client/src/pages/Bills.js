import React, { useEffect, useRef, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';

function Bills() {
    // useRef hook: Creates a reference to a DOM element for printing
    const componentRef = useRef();
    
    // useState hook: Manages component state
    // billsData: Stores all bills fetched from the API
    const [billsData, setBillsData] = useState([]);
    // printBillModalVisibility: Controls the visibility of the bill print modal
    const [printBillModalVisibility, setPrintBillModalVisibilty] = useState(false);
    // selectedBill: Stores the bill selected for viewing/printing
    const [selectedBill, setSelectedBill] = useState(null);
    
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

    // Table column definitions for bills
    const columns = [
      {
        title: "Id",
        dataIndex: "_id",
      },
      {
        title: "Customer",
        dataIndex: "customerName",
      },
      {
        title: "SubTotal",
        dataIndex: "subTotal",
      },
      {
        title: "Tax",
        dataIndex: "tax",
      },
      {
        title: "Total",
        dataIndex: "totalAmount",
      },
      {
        title: "Actions",
        dataIndex: "_id",
        render: (id, record) => (
          <div className="d-flex">
            <EyeOutlined
              className="mx-2"
              onClick={() => {
                setSelectedBill(record); // Set the selected bill
                setPrintBillModalVisibilty(true); // Open the print modal
              }}
            />
          </div>
        ),
      },
    ];
    
    // Table column definitions for cart items in bill details
    const cartcolumns = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Price",
        dataIndex: "price",
      },
      {
        title: "Quantity",
        dataIndex: "_id",
        render: (id, record) => (
          <div>
            <b>{record.quantity}</b>
          </div>
        ),
      },
      {
          title: "Total fare",
          dataIndex: "_id",
          render: (id, record) => (
            <div>
              <b>{record.quantity * record.price}</b> {/* Calculate total for each item */}
            </div>
          ),
        },
    ];

    // useEffect hook: Runs after component mounts
    // Purpose: Fetch all bills when the component is first rendered
    useEffect(() => {
      getAllBills();
    }, []);

    // useReactToPrint hook: Provides functionality to print the referenced component
    const handlePrint = useReactToPrint({
      content: () => componentRef.current, // Reference to the printable content
    });

    return (
      <DefaultLayout>
        <div className="d-flex justify-content-between">
          <h3>Items</h3>
        </div>
        <Table columns={columns} dataSource={billsData} bordered />

        {printBillModalVisibility && (
          <Modal
            onCancel={() => {
              setPrintBillModalVisibilty(false); // Close the modal
            }}
            visible={printBillModalVisibility}
            title="Bill Details"
            footer={false}
            width={800}
          >
            <div className="bill-model p-3" ref={componentRef}> {/* Attach ref for printing */}
              <div className="d-flex justify-content-between bill-header pb-2">
                <div>
                  <h1>
                    <b>Aura store</b>
                  </h1>
                </div>
                <div>
                  <p>Rosmead Place</p>
                  <p>Colombo 0070</p>
                  <p>0768381580</p>
                </div>
              </div>
              <div className="bill-customer-details my-2">
                <p>
                  <b>Name</b> : {selectedBill.customerName}
                </p>
                <p>
                  <b>Phone Number</b> : {selectedBill.customerPhoneNumber}
                </p>
                <p>
                  <b>Date</b> :{" "}
                  {selectedBill.createdAt.toString().substring(0, 10)} {/* Format date */}
                </p>
              </div>
              <Table dataSource={selectedBill.cartItems} columns={cartcolumns} pagination={false}/>

              <div className="dotted-border">
                  <p><b>SUB TOTAL</b> : ${selectedBill.subTotal}</p>
                  <p><b>Tax</b> : ${selectedBill.tax}</p>
              </div>

              <div>
                  <h2><b>GRAND TOTAL : ${selectedBill.totalAmount}</b></h2>
              </div>
              <div className="dotted-border"></div>

              <div className="text-center">
                    <p>Thank you for shopping with AURA!</p>
                    <p>Visit Again</p>
              </div>
            </div>

            <div className="d-flex justify-content-end">
                    <Button type='primary' onClick={handlePrint}>Print Bill</Button> {/* Trigger print */}
            </div>
          </Modal>
        )}
      </DefaultLayout>
    );
}

export default Bills;