// Initial state for the Redux store
// loading: Boolean to track global loading state (show/hide spinners)
// cartItems: Array to store items added to the shopping cart
const initailState = {
  loading: false,
  cartItems: [],
};

// Root reducer function - handles state updates based on action types
// Reducers are pure functions that take current state and an action, return new state
export const rootReducer = (state = initailState, action) => {
  // Switch statement to handle different action types
  switch (action.type) {
    // Case for adding an item to cart
    case "addToCart":
      return {
        ...state, // Spread existing state to maintain other properties
        // Update cartItems by adding new item to the end of the array
        cartItems: [...state.cartItems, action.payload],
      };
    
    // Case for deleting an item from cart
    case "deleteFromCart":
      return {
        ...state, // Spread existing state
        // Filter out the item with matching _id
        cartItems: state.cartItems.filter((item) => item._id !== action.payload._id),
      };
    
    // Case for updating item quantity in cart
    case "updateCart":
      return {
        ...state, // Spread existing state
        // Map through cartItems and update quantity for matching item
        cartItems: state.cartItems.map((item) =>
          // Use loose equality (==) instead of strict (===) 
          // This might be intentional to handle string vs number ID comparison
          item._id == action.payload._id
            ? { ...item, quantity: action.payload.quantity } // Update quantity
            : item // Return unchanged item if IDs don't match
        ),
      };
    
    // Case for showing global loading indicator
    case 'showLoading':
      return {
        ...state, // Spread existing state
        loading: true // Set loading to true
      };
    
    // Case for hiding global loading indicator  
    case 'hideLoading':
      return {
        ...state, // Spread existing state
        loading: false // Set loading to false
      };
    
    // Default case - return current state unchanged for unknown actions
    default:
      return state;
  }
};