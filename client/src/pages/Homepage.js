import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { Col, Row } from "antd";
import Item from "../components/Item";
import "../resourses/items.css";
import { useDispatch } from "react-redux";

function Homepage() {
  // useState hook: Manages component state
  // itemsData: Stores all items fetched from the API
  const [itemsData, setItemsData] = useState([]);
  // categories: Stores all categories fetched from the API
  const [categories, setCategories] = useState([]);
  // selectedCategory: Tracks the currently selected category for filtering items
  const [selectedCategory, setSelectedCategory] = useState("");
  
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
        setItemsData(response.data); // Store items in state
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" }); // Hide global loading indicator on error
        console.log(error);
      });
  };

  // Function to fetch all categories from the API
  const getAllCategories = () => {
    dispatch({ type: "showLoading" }); // Show global loading indicator
    axios
      .get("/api/categories/get-all-categories")
      .then((response) => {
        dispatch({ type: "hideLoading" }); // Hide global loading indicator
        setCategories(response.data); // Store categories in state
        
        // Set the first category as selected by default if categories exist
        if (response.data.length > 0 && !selectedCategory) {
          setSelectedCategory(response.data[0].name);
        }
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" }); // Hide global loading indicator on error
        console.log(error);
      });
  };

  // useEffect hook: Runs after component mounts and when dependencies change
  // Empty dependency array means this runs only once after component mounts
  // Purpose: Fetch initial data (items and categories) when the component is first rendered
  useEffect(() => {
    getAllItems();
    getAllCategories();
  }, []); // Empty dependency array ensures this runs only once

  return (
      <DefaultLayout>
      {/* Categories container with scroll */}
      <div className="categories-scroll-container">
        <div className="categories-wrapper">
          {categories.length > 0 ? (
            // If categories exist, show them as clickable elements
            categories.map((category) => (
              <div
                key={category._id}
                onClick={() => setSelectedCategory(category.name)} // Update selected category on click
                className={`category ${selectedCategory === category.name ? 'selected-category' : ''}`}
              >
                <h4>{category.name}</h4>
                <img src={category.imageURL} alt={category.name} height="60" width="80" />
              </div>
            ))
          ) : (
            // If no categories exist, show this message
            <p>No categories available. Please add categories first.</p>
          )}
        </div>
      </div>

      {/* Display items filtered by the selected category */}
      <Row gutter={20}>
        {itemsData
          .filter((i) => i.category === selectedCategory) // Filter items by selected category
          .map((item) => (
            <Col key={item._id} xs={24} lg={6} md={12} sm={6}>
              <Item item={item} /> {/* Render individual item component */}
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
}

export default Homepage;