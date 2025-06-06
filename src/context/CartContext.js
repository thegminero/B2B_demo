import { createContext, useContext, useState } from 'react';
import { insights } from '../services/algoliaInsights';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity = 1, queryID = null) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.objectID === product.objectID);
      const price = product.store_data?.[`store_${product.selectedStore?.padStart(3, '0')}`]?.price || product.price || 0;
      const eventValue = price * quantity;

      console.log('Add to cart event data:', {
        productID: product.objectID,
        queryID,
        price,
        quantity,
        eventValue
      });

      // Create objectData for add to cart event
      const objectData = {
        queryID: queryID || undefined,
        price: price,
        quantity: quantity
      };

      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.objectID === product.objectID
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        // Track add to cart event for existing item
        if (queryID) {
          insights.addedToCartObjectIDsAfterSearch(
            'Add to Cart',
            'productos_electronicos_b2b',
            [product.objectID],
            queryID,
            eventValue,
            [objectData]
          );
        } else {
          // Send conversion event without query for direct adds
          insights.addedToCartObjectIDs(
            'Add to Cart - Direct',
            'productos_electronicos_b2b',
            [product.objectID],
            eventValue,
            [objectData]
          );
        }
        
        return updatedItems;
      } else {
        const newItem = { ...product, quantity, queryID: queryID || null };
        
        // Track add to cart event for new item
        if (queryID) {
          insights.addedToCartObjectIDsAfterSearch(
            'Add to Cart',
            'productos_electronicos_b2b',
            [product.objectID],
            queryID,
            eventValue,
            [objectData]
          );
        } else {
          // Send conversion event without query for direct adds
          insights.addedToCartObjectIDs(
            'Add to Cart - Direct',
            'productos_electronicos_b2b',
            [product.objectID],
            eventValue,
            [objectData]
          );
        }
        
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.objectID !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.objectID === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const completePurchase = () => {
    console.log('=== STARTING PURCHASE FLOW ===');
    console.log('Cart items:', cartItems);

    // Track purchase events with revenue and objectData
    let totalRevenue = 0;

    cartItems.forEach((item, index) => {
      const price = item.store_data?.[`store_${item.selectedStore?.padStart(3, '0')}`]?.price || item.price || 0;
      const itemTotal = price * item.quantity;
      totalRevenue += itemTotal;

      console.log(`Processing item ${index + 1}:`, {
        objectID: item.objectID,
        name: item.name,
        price,
        quantity: item.quantity,
        itemTotal,
        queryID: item.queryID
      });

      // Create objectData for this purchase item
      const objectData = {
        queryID: item.queryID || undefined,
        price: price,
        quantity: item.quantity
      };

      // Always track purchase, regardless of queryID
      if (item.queryID) {
        console.log('Sending purchase event with queryID for:', item.objectID);
        insights.purchasedObjectIDsAfterSearch(
          'Purchase',
          'productos_electronicos_b2b',
          [item.objectID],
          item.queryID,
          itemTotal,
          [objectData]
        );
      } else {
        console.log('Sending direct purchase event for:', item.objectID);
        insights.purchasedObjectIDs(
          'Purchase - Direct',
          'productos_electronicos_b2b',
          [item.objectID],
          itemTotal,
          [objectData]
        );
      }
    });

    console.log('Total revenue for this purchase:', totalRevenue);
    console.log('=== PURCHASE EVENTS SENT ===');

    // Clear cart after purchase
    const purchasedItems = [...cartItems];
    clearCart();
    
    const orderData = {
      items: purchasedItems,
      totalRevenue,
      orderNumber: 'ORD-' + Date.now()
    };

    console.log('Order completed:', orderData);
    
    return orderData;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.store_data?.[`store_${item.selectedStore?.padStart(3, '0')}`]?.price || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      completePurchase,
      getCartTotal,
      getCartItemsCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}; 