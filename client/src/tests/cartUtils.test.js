const { calculateCartTotal, calculateItemTotal, calculateTax, calculateGrandTotal } = require('../utils/cartUtils');

describe('Cart Calculations', () => {
  // Test for individual item total
  describe('calculateItemTotal', () => {
    it('should calculate total for a single item (price × quantity)', () => {
      const item = { price: 10.99, quantity: 2 };
      const total = calculateItemTotal(item);
      expect(total).toBe(21.98);
    });

    it('should return 0 if quantity is 0', () => {
      const item = { price: 10.99, quantity: 0 };
      const total = calculateItemTotal(item);
      expect(total).toBe(0);
    });
  });

  // Test for entire cart total
  describe('calculateCartTotal', () => {
    it('should calculate sum of all item totals in cart', () => {
      const cartItems = [
        { price: 10, quantity: 2 }, // 20
        { price: 5, quantity: 3 },  // 15
        { price: 2.5, quantity: 4 } // 10
      ];
      
      const total = calculateCartTotal(cartItems);
      expect(total).toBe(45); // 20 + 15 + 10
    });

    it('should return 0 for empty cart', () => {
      const total = calculateCartTotal([]);
      expect(total).toBe(0);
    });
  });
    // NEW: Test tax calculation
  describe('calculateTax', () => {
    it('should calculate 10% tax correctly', () => {
      const tax = calculateTax(100);
      expect(tax).toBe(10.00);
    });

    it('should handle decimal amounts', () => {
      const tax = calculateTax(57.50);
      expect(tax).toBe(5.75);
    });
  });

  // NEW: Test grand total calculation
  describe('calculateGrandTotal', () => {
    it('should calculate subTotal + tax correctly', () => {
      const grandTotal = calculateGrandTotal(100);
      expect(grandTotal).toBe(110.00);
    });

    it('should handle decimal amounts', () => {
      const grandTotal = calculateGrandTotal(57.50);
      expect(grandTotal).toBe(63.25); // 57.50 + 5.75
    });
  });
});