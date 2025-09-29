import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table, Spin } from "antd";

function Items() {
  // useState hook: Manages component state
  // itemsData: Stores all items fetched from the API
  const [itemsData, setItemsData] = useState([]);
  // filteredItems: Stores the filtered list of items based on search criteria
  const [filteredItems, setFilteredItems] = useState([]);
  // addEditModalVisibilty: Controls the visibility of the Add/Edit modal
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  // editingItem: Stores the item being edited (null when adding a new item)
  const [editingItem, setEditingItem] = useState(null);
  // searchText: Tracks the current search input value
  const [searchText, setSearchText] = useState("");
  // categories: Stores all categories fetched from the API for the dropdown
  const [categories, setCategories] = useState([]);
  // loadingCategories: Tracks loading state for categories API call
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // useDispatch hook: Provides access to the Redux store's dispatch function
  // Used to show/hide global loading indicators during API calls
  const dispatch = useDispatch();
  
  // Function to fetch all items from the API
  const getAllItems = () => {
    dispatch({ type: "showLoading" }); // Show global loading indicator
    axios
      .get("/api/items/get-all-items")
      .then((response) => {
        dispatch({ type: "hideLoading" }); // Hide global loading indicator
        setItemsData(response.data); // Store all items in state
        setFilteredItems(response.data); // Initialize filtered items with all items
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" }); // Hide global loading indicator on error
        console.log(error);
      });
  };

  // Function to fetch all categories from the API for the dropdown
  const getAllCategories = () => {
    setLoadingCategories(true); // Set loading state for categories
    axios
      .get("/api/categories/get-all-categories")
      .then((response) => {
        setCategories(response.data); // Store categories in state
        setLoadingCategories(false); // Reset loading state
      })
      .catch((error) => {
        setLoadingCategories(false); // Reset loading state on error
        console.log(error);
      });
  };

  // Function to delete an item
  const deleteItem = (record) => {
    dispatch({ type: "showLoading" }); // Show global loading indicator
    axios
      .delete(`/api/items/${record._id}`)
      .then(() => {
        message.success("Item deleted successfully");
        getAllItems(); // Refresh the items list after deletion
      })
      .catch((error) => {
        message.error(error.response?.data?.error || "Something went wrong");
        console.error(error);
      });
  };

  // Search items by name or category
  const handleSearch = (value) => {
    setSearchText(value);
    
    if (!value.trim()) {
      setFilteredItems(itemsData); // Show all items if search is empty
      return;
    }

    // Filter items based on search text (name or category)
    const filtered = itemsData.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.category.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredItems(filtered);
  };

  // Table column definitions
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // Enable sorting by name
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" style={{objectFit: 'cover'}} />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `$${price}`, // Format price with dollar sign
      sorter: (a, b) => a.price - b.price, // Enable sorting by price
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category), // Enable sorting by category
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditOutlined
            className="mx-2"
            style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
            onClick={() => {
              setEditingItem(record); // Set the item to be edited
              setAddEditModalVisibilty(true); // Open the modal
            }}
          />
          <DeleteOutlined 
            className="mx-2" 
            style={{ fontSize: '20px', color: 'red', cursor: 'pointer' }}
            onClick={() => deleteItem(record)} // Delete the item
          />
        </div>
      ),
    },
  ];

  // useEffect hook: Runs after component mounts
  // Purpose: Fetch initial data (items and categories) when the component is first rendered
  useEffect(() => {
    getAllItems();
    getAllCategories();
  }, []); // Empty dependency array ensures this runs only once

  // useEffect hook: Runs when addEditModalVisibilty changes
  // Purpose: Refresh categories each time the modal is opened to ensure we have the latest categories
  useEffect(() => {
    if (addEditModalVisibilty) {
      getAllCategories(); // Refresh categories when modal opens
    }
  }, [addEditModalVisibilty]); // Dependency: runs when modal visibility changes

  // Form submission handler for adding/editing items
  const onFinish = (values) => {
    dispatch({ type: "showLoading" }); // Show global loading indicator
    
    if (editingItem === null) {
      // Add new item
      axios
        .post("/api/items/add-item", values)
        .then((response) => {
          dispatch({ type: "hideLoading" }); // Hide global loading indicator
          message.success("Item added successfully");
          setAddEditModalVisibilty(false); // Close the modal
          getAllItems(); // Refresh the items list
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" }); // Hide global loading indicator on error
          message.error("Something went wrong");
          console.log(error);
        });
    } else {
      // Edit existing item
      axios
        .put(`/api/items/${editingItem._id}`, values)
        .then(() => {
          message.success("Item edited successfully");
          setEditingItem(null); // Reset editing item
          setAddEditModalVisibilty(false); // Close the modal
          getAllItems(); // Refresh the items list
        })
        .catch((error) => {
          message.error(error.response?.data?.error || "Something went wrong");
          console.error(error);
        });
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Items</h3>
        <div className="d-flex align-items-center">
          <Input
            placeholder="Search items by name or category..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)} // Handle search input changes
            style={{ width: 300, marginRight: 16 }}
            allowClear
          />
          <Button type="primary" onClick={() => setAddEditModalVisibilty(true)}>
            Add Item
          </Button>
        </div>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={filteredItems} // Use filtered items for display
        bordered 
        rowKey="_id"
        pagination={{ pageSize: 10 }} // Enable pagination
      />

      {addEditModalVisibilty && (
        <Modal
          onCancel={() => {
            setEditingItem(null); // Reset editing item
            setAddEditModalVisibilty(false); // Close the modal
          }}
          open={addEditModalVisibilty}
          title={`${editingItem !== null ? 'Edit Item' : 'Add New Item'}`}
          footer={false}
          destroyOnClose={true} // Destroy modal content when closed
        >
          <Form
            initialValues={editingItem || { name: '', price: '', image: '', category: '' }} // Prefill form when editing
            layout="vertical"
            onFinish={onFinish} // Handle form submission
          >
            <Form.Item 
              name="name" 
              label="Name"
              rules={[{ required: true, message: 'Please enter item name' }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item 
              name="price" 
              label="Price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <Input type="number" min="0" step="0.01" />
            </Form.Item>
            
            <Form.Item 
              name="image" 
              label="Image URL"
              rules={[{ required: true, message: 'Please enter image URL' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item 
              name="category" 
              label="Category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select
                placeholder="Select a category"
                // Show spinner when loading, or message if no categories found
                notFoundContent={loadingCategories ? <Spin size="small" /> : "No categories found"}
              >
                {/* Dynamically render categories from API */}
                {categories.map(category => (
                  <Select.Option key={category._id} value={category.name}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                {editingItem !== null ? 'UPDATE' : 'SAVE'}
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default Items;