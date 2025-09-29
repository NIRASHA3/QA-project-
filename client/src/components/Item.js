import { Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import "../resourses/layout.css";
import "../resourses/items.css"; // with button styles

function Item({ item }) {
  // useDispatch hook: Provides access to the Redux store's dispatch function
  // Used to dispatch actions that update the global state (adding items to cart)
  const dispatch = useDispatch();
  
  // useState hook: Manages component state
  // isAdding: Boolean that tracks whether an item is currently being added to cart
  // Used to show loading state on the button during the add operation
  const [isAdding, setIsAdding] = useState(false);

  // Function to handle adding item to cart
  function addToCart() {
    setIsAdding(true); // Set loading state to true to show button is working
    
    // Dispatch action to add item to cart in Redux store
    // payload contains the item data with quantity set to 1
    dispatch({ type: 'addToCart', payload: { ...item, quantity: 1 } });
    
    // Show success message using Ant Design's message component
    message.success(`${item.name} added to cart!`);
    
    // Reset button state after 500ms (animation duration)
    // This creates a smooth visual feedback for the user
    setTimeout(() => setIsAdding(false), 500);
  }

  return (
    <div className='item'>
      {/* Display item name */}
      <h4 className='name'>{item.name}</h4>
      
      {/* Display item image with alt text for accessibility */}
      <img src={item.image} alt={item.name} height='100' width='100'/>
      
      {/* Display item price */}
      <h4 className='price'><b>Price : </b>${item.price}</h4>
      
      {/* Add to cart button container - aligned to the right */}
      <div className="d-flex justify-content-end">
        <Button 
          type="primary"           // Primary button style
          icon={<ShoppingCartOutlined />} // Shopping cart icon
          onClick={addToCart}      // Click handler
          loading={isAdding}       // Shows loading spinner when true
          className="add-to-cart-btn" // Custom CSS class for styling
        >
          {/* Conditional button text based on loading state */}
          {isAdding ? 'Adding...' : 'Add To Cart'}
        </Button>
      </div>
    </div>
  ); // Closing div tag was missing in the original code
}

export default Item;