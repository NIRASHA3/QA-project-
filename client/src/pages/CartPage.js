import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { calculateCartTotal, calculateItemTotal } from "../utils/cartUtils";
import { calculateTax, calculateGrandTotal  } from "../utils/cartUtils";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function CartPage() {
  // useSelector hook: Extracts data from the Redux store state
  // cartItems: Gets the cart items from the Redux store
  const { cartItems } = useSelector((state) => state.rootReducer);

  // useState hook: Manages component state
  // billChargeModal: Controls the visibility of the bill charge modal
  const [billChargeModal, setBillChargeModal] = useState(false);

  // subTotal: Stores the calculated subtotal of all items in the cart
  const [subTotal, setSubTotal] = useState(0);

  // useNavigate hook: Provides navigation function for programmatic routing
  const navigate = useNavigate();

  // useDispatch hook: Provides access to the Redux store's dispatch function
  const dispatch = useDispatch();

  // Function to increase item quantity
  const increaseQuantity = (record) => {
    dispatch({
      type: "updateCart",
      payload: { ...record, quantity: record.quantity + 1 }, // Increment quantity
    });
  };

  // Function to decrease item quantity
  const decreaseQuantity = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "updateCart",
        payload: { ...record, quantity: record.quantity - 1 }, // Decrement quantity
      });
    }
  };

  // Table column definitions for cart items
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `$${price?.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            onClick={() => increaseQuantity(record)} // Increase quantity
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            onClick={() => decreaseQuantity(record)} // Decrease quantity
          />
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "_id",
      render: (id, record) => {
        const itemTotal = calculateItemTotal(record);
        // Add safety check before calling toFixed()
        return (
          <span>
            ${typeof itemTotal === "number" ? itemTotal.toFixed(2) : "0.00"}
          </span>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          onClick={() => dispatch({ type: "deleteFromCart", payload: record })} // Remove item from cart
        />
      ),
    },
  ];
  /*
  //Runs after component mounts and when cartItems change
  //Calculate the subtotal whenever cart items change
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity; // Calculate subtotal
    });
    setSubTotal(temp); // Update subtotal state
  }, [cartItems]);
  */

  // REFACTORED: Simplified useEffect using utility function
  useEffect(() => {
    const total = calculateCartTotal(cartItems);
    setSubTotal(total);
  }, [cartItems]);

  // Form submission handler for charging a bill
  const onFinish = (values) => {
    const reqObject = {
      ...values,
      subTotal,
      cartItems,
      tax: Number(((subTotal / 100) * 10).toFixed(2)), // Calculate 10% tax
      totalAmount: Number(
        subTotal + Number(((subTotal / 100) * 10).toFixed(2)) // Calculate total amount
      ),
      userId: JSON.parse(localStorage.getItem("pos-user"))._id, // Get user ID from localStorage
    };

    axios
      .post("/api/bills/charge-bill", reqObject)
      .then(() => {
        message.success("Bill Charged Successfully");
        navigate("/bills"); // Navigate to bills page after successful charge
      })
      .catch(() => {
        message.success("Something went wrong");
      });
  };

  return (
    <DefaultLayout>
      <h3>Cart</h3>
      <Table
        columns={columns}
        dataSource={cartItems}
        bordered
        pagination={false}
      />
      <hr />
      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subtotal">
          <h4>
            SUB TOTAL : <b>${subTotal}</b>
          </h4>
        </div>

        <Button type="primary" onClick={() => setBillChargeModal(true)}>
          CHARGE BILL
        </Button>
      </div>

      <Modal
        title="Charge Bill"
        visible={billChargeModal}
        footer={false}
        onCancel={() => setBillChargeModal(false)} // Close modal
      >
        {" "}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="customerName" label="Customer Name">
            <Input />
          </Form.Item>
          <Form.Item name="customerPhoneNumber" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item name="paymentMode" label="Payment Mode">
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>
          <div className="charge-bill-amount">
            <h5>
              SubTotal : <b>${subTotal.toFixed(2)}</b>
            </h5>
            <h5>
               Tax : <b>${calculateTax(subTotal).toFixed(2)}</b>
            </h5>
            <hr />
            <h3>
              Grand Total : <b>${calculateGrandTotal(subTotal).toFixed(2)}</b>
            </h3>
          </div>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary">
              GENERATE BILL
            </Button>
          </div>
        </Form>{" "}
      </Modal>
    </DefaultLayout>
  );
}

export default CartPage;
