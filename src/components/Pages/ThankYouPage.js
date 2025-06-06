import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from '@phosphor-icons/react';
import { getCategoryIcon } from '../../utils/categoryIcons';

// Thank You Page
export const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (orderData) {
      console.log('Thank you page loaded with order data:', orderData);
      // Purchase events are already sent from CartContext.completePurchase()
      // No additional insights events needed here
    }
  }, [orderData]);

  if (!orderData) {
    console.log('No order data found, redirecting to home');
    navigate('/');
    return null;
  }

  return (
    <main className="thank-you-page">
      <div className="thank-you-container">
        <div className="thank-you-content">
          <div className="thank-you-icon">
            <CheckCircle size={120} color="#28a745" weight="fill" />
          </div>
          
          <h1>¡Gracias por tu compra!</h1>
          <p className="thank-you-subtitle">Tu pedido ha sido procesado exitosamente</p>
          
          <div className="order-summary">
            <h2>Resumen del Pedido</h2>
            <div className="order-info">
              <div className="order-number">
                <strong>Número de Orden: {orderData.orderNumber}</strong>
              </div>
              <div className="order-total">
                <strong>Total: ${orderData.totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="order-items-count">
                {orderData.items.length} producto{orderData.items.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="order-items">
              <h3>Productos Comprados</h3>
              {orderData.items.map((item) => {
                const IconComponent = getCategoryIcon(item.categorias_flat);
                const storeData = item.store_data?.[`store_${item.selectedStore?.padStart(3, '0')}`];
                const price = storeData?.price || item.price || 0;
                
                return (
                  <div key={item.objectID} className="order-item">
                    <div className="order-item-icon">
                      <IconComponent size={32} />
                    </div>
                    <div className="order-item-details">
                      <h4>{item.name}</h4>
                      <p>Cantidad: {item.quantity}</p>
                      <p>Precio: ${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="thank-you-actions">
            <button className="primary-btn" onClick={() => navigate('/')}>
              Volver al Inicio
            </button>
            <button className="secondary-btn" onClick={() => navigate('/search')}>
              Seguir Comprando
            </button>
          </div>
          
          <div className="thank-you-message">
            <p>Recibirás un email de confirmación con los detalles de tu pedido.</p>
            <p>El tiempo estimado de entrega es de 3-5 días hábiles.</p>
          </div>
        </div>
      </div>
    </main>
  );
}; 