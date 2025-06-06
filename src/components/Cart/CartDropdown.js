import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Minus, Plus, Trash } from '@phosphor-icons/react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { getCategoryIcon } from '../../utils/categoryIcons';

// Cart Dropdown Component
export const CartDropdown = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { selectedStore, stores } = useStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleViewCart = () => {
    navigate('/cart');
    setIsCartOpen(false);
  };

  return (
    <div className="cart-dropdown-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-dropdown" onClick={(e) => e.stopPropagation()}>
        <div className="cart-dropdown-header">
          <h3>Mi Carrito</h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="cart-dropdown-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart size={48} />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => {
                  const storeData = item.store_data?.[`store_${selectedStore.padStart(3, '0')}`];
                  const price = storeData?.price || item.price || 0;
                  const IconComponent = getCategoryIcon(item.categorias_flat);
                  
                  return (
                    <div key={item.objectID} className="cart-item">
                      <div className="cart-item-image">
                        <IconComponent size={32} />
                      </div>
                      <div className="cart-item-details">
                        <h4>{item.name}</h4>
                        <p className="cart-item-price">${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                        <div className="cart-item-controls">
                          <button onClick={() => updateQuantity(item.objectID, item.quantity - 1)}>
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.objectID, item.quantity + 1)}>
                            <Plus size={14} />
                          </button>
                          <button className="remove-btn" onClick={() => removeFromCart(item.objectID)}>
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="cart-dropdown-footer">
                <div className="cart-total">
                  <strong>Total: ${getCartTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
                </div>
                <button className="view-cart-btn" onClick={handleViewCart}>
                  Ver Carrito Completo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 