// Calculate total for a single item
const calculateItemTotal = (item) => {
  if (!item || typeof item.price !== 'number') return 0;
  const quantity = item.quantity || 0;
  return item.price * quantity;
};

// Calculate total for entire cart
const calculateCartTotal = (cartItems) => {
  if (!Array.isArray(cartItems)) return 0;
  
  return cartItems.reduce((total, item) => {
    return total + calculateItemTotal(item);
  }, 0);
};
//Enhanced Refactoring by creating more specialized utility functions for your tax and total calculations

// Calculate tax amount (10%)
const calculateTax = (subTotal) => {
  return parseFloat(((subTotal / 100) * 10).toFixed(2));
};

// Calculate grand total (subTotal + tax)
const calculateGrandTotal = (subTotal) => {
  const tax = calculateTax(subTotal);
  return parseFloat((subTotal + tax).toFixed(2));
};


module.exports = {
  calculateItemTotal,
  calculateCartTotal,
  calculateTax, 
  calculateGrandTotal
};