import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Table } from "antd";

function Categories() {
  // useState hook: Manages component state
  // categoriesData: Stores all categories fetched from the API
  const [categoriesData, setCategoriesData] = useState([]);
  // filteredCategories: Stores the filtered list of categories based on search criteria
  const [filteredCategories, setFilteredCategories] = useState([]);
  // addEditModalVisibility: Controls the visibility of the Add/Edit modal
  const [addEditModalVisibility, setAddEditModalVisibility] = useState(false);
  // editingCategory: Stores the category being edited (null when adding a new category)
  const [editingCategory, setEditingCategory] = useState(null);
  // searchText: Tracks the current search input value
  const [searchText, setSearchText] = useState("");
  
  // useDispatch hook: Provides access to the Redux store's dispatch function
  const dispatch = useDispatch();
  
  // Function to fetch all categories from the API
  const getAllCategories = () => {
    dispatch({ type: "showLoading" }); // Show global loading indicator
    axios
      .get("/api/categories/get-all-categories")
      .then((response) => {
        dispatch({ type: "hideLoading" }); // Hide global loading indicator
        setCategoriesData(response.data); // Store all categories in state
        setFilteredCategories(response.data); // Initialize filtered categories with all categories
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" }); // Hide global loading indicator on error
        console.log(error);
      });
  };

  // Function to delete a category
  const deleteCategory = (record) => {
    dispatch({ type: "showLoading" }); // Show global loading indicator
    axios
      .delete(`/api/categories/delete-category/${record._id}`)
      .then(() => {
        message.success("Category deleted successfully");
        getAllCategories(); // Refresh the categories list after deletion
      })
      .catch((error) => {
        message.error(error.response?.data?.error || "Something went wrong");
        console.error(error);
      });
  };

  // Search categories by name 
  const handleSearch = (value) => {
    setSearchText(value);
    
    if (!value.trim()) {
      setFilteredCategories(categoriesData); // Show all categories if search is empty
      return;
    }

    // Filter categories based on search text (name)
    const filtered = categoriesData.filter(category =>
      category.name.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredCategories(filtered);
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
      dataIndex: "imageURL",
      render: (imageURL, record) => (
        <img src={imageURL} alt={record.name} height="60" width="60" style={{objectFit: 'cover'}} />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
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
              setEditingCategory(record); // Set the category to be edited
              setAddEditModalVisibility(true); // Open the modal
            }}
          />
          <DeleteOutlined 
            className="mx-2" 
            style={{ fontSize: '20px', color: 'red', cursor: 'pointer' }}
            onClick={() => deleteCategory(record)} // Delete the category
          />
        </div>
      ),
    },
  ];

  // useEffect hook: Runs after component mounts
  // Purpose: Fetch all categories when the component is first rendered
  useEffect(() => {
    getAllCategories();
  }, []);

  // Form submission handler for adding/editing categories
  const onFinish = (values) => {
    dispatch({ type: "showLoading" }); // Show global loading indicator
    
    if (editingCategory === null) {
      // Add new category
      axios
        .post("/api/categories/add-category", values)
        .then((response) => {
          dispatch({ type: "hideLoading" }); // Hide global loading indicator
          message.success("Category added successfully");
          setAddEditModalVisibility(false); // Close the modal
          getAllCategories(); // Refresh the categories list
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" }); // Hide global loading indicator on error
          message.error("Something went wrong");
          console.log(error);
        });
    } else {
      // Edit existing category
      axios
        .put(`/api/categories/update-category/${editingCategory._id}`, values)
        .then(() => {
          message.success("Category updated successfully");
          setEditingCategory(null); // Reset editing category
          setAddEditModalVisibility(false); // Close the modal
          getAllCategories(); // Refresh the categories list
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
        <h3>Categories</h3>
        <div className="d-flex align-items-center">
          <Input
            placeholder="Search categories by name..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)} // Handle search input changes
            style={{ width: 250, marginRight: 16 }}
            allowClear
          />
          <Button type="primary" onClick={() => setAddEditModalVisibility(true)}>
            Add Category
          </Button>
        </div>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={filteredCategories} // Use filtered categories for display
        bordered 
        rowKey="_id"
        pagination={{ pageSize: 10 }} // Enable pagination
        style={{ marginTop: '20px' }}
      />

      {addEditModalVisibility && (
        <Modal
          onCancel={() => {
            setEditingCategory(null); // Reset editing category
            setAddEditModalVisibility(false); // Close the modal
          }}
          open={addEditModalVisibility}
          title={`${editingCategory !== null ? 'Edit Category' : 'Add New Category'}`}
          footer={false}
          destroyOnClose={true} // Destroy modal content when closed
        >
          <Form
            initialValues={editingCategory || { name: '', description: '', imageURL: '' }} // Prefill form when editing
            layout="vertical"
            onFinish={onFinish} // Handle form submission
          >
            <Form.Item 
              name="name" 
              label="Name" 
              rules={[{ required: true, message: 'Please enter category name' }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item 
              name="description" 
              label="Description"
              rules={[{ required: true, message: 'Please enter category description' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            
            <Form.Item 
              name="imageURL" 
              label="Image URL"
              rules={[{ required: true, message: 'Please enter image URL' }]}
            >
              <Input />
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                {editingCategory !== null ? 'UPDATE' : 'SAVE'}
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default Categories;