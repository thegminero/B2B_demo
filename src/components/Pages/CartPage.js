import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash, Minus, Plus, CreditCard } from '@phosphor-icons/react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { getCategoryIcon } from '../../utils/categoryIcons';

// Cart Page
export const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, completePurchase } = useCart();
  const { selectedStore, stores } = useStore();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <h1>Mi Carrito</h1>
          <div className="cart-empty-state">
            <ShoppingCart size={80} />
            <h2>Tu carrito está vacío</h2>
            <p>Explora nuestros productos y agrega algunos artículos a tu carrito.</p>
            <button className="browse-products-btn" onClick={() => navigate('/')}>
              Explorar Productos
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleCheckout = () => {
    console.log('Checkout button clicked!');
    console.log('Current cart items before purchase:', cartItems);
    
    const purchaseData = completePurchase();
    
    console.log('Purchase completed, navigating to thank you page with:', purchaseData);
    
    navigate('/thank-you', { 
      state: { 
        orderData: purchaseData 
      } 
    });
  };

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Mi Carrito ({cartItems.length} productos)</h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            <Trash size={16} />
            Vaciar Carrito
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            {cartItems.map((item) => {
              const storeData = item.store_data?.[`store_${selectedStore.padStart(3, '0')}`];
              const price = storeData?.price || item.price || 0;
              const total = price * item.quantity;
              const IconComponent = getCategoryIcon(item.categorias_flat);

              return (
                <div key={item.objectID} className="cart-page-item">
                  <div className="cart-item-image" onClick={() => navigate(`/producto/${item.objectID}`)}>
                    <IconComponent size={60} />
                  </div>
                  
                  <div className="cart-item-info">
                    <h3 onClick={() => navigate(`/producto/${item.objectID}`)}>{item.name}</h3>
                    <p className="cart-item-sku">SKU: {item.sku || item.objectID}</p>
                    <p className="cart-item-store">Tienda: {stores[selectedStore]?.city}</p>
                    {item.queryID && (
                      <p className="cart-item-attribution">Agregado desde búsqueda</p>
                    )}
                  </div>
                  
                  <div className="cart-item-price">
                    <div className="unit-price">${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    <div className="price-label">Precio unitario</div>
                  </div>
                  
                  <div className="cart-item-quantity">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.objectID, item.quantity - 1)}>
                        <Minus size={16} />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.objectID, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart-item-total">
                    <div className="total-price">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    <div className="price-label">Subtotal</div>
                  </div>
                  
                  <div className="cart-item-actions">
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.objectID)}>
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen del Pedido</h3>
              
              <div className="summary-line">
                <span>Productos ({cartItems.length})</span>
                <span>${getCartTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="summary-line">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              
              <div className="summary-line total">
                <span>Total</span>
                <span>${getCartTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <button className="checkout-btn" onClick={handleCheckout}>
                <CreditCard size={20} />
                Finalizar Compra
              </button>
              
              <button className="continue-shopping-btn" onClick={() => navigate('/')}>
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}; 