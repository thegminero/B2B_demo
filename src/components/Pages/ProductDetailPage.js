import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, Star, Plus, Minus, ShoppingCart } from '@phosphor-icons/react';
import { searchClient } from '../../services/algoliaClient';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { getCategoryIcon } from '../../utils/categoryIcons';

// Product Detail Page
export const ProductDetailPage = () => {
  const { productId } = useParams();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const queryID = searchParams.get('queryID');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { selectedStore, stores, getVisibilityFilter } = useStore();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await searchClient.search([{
          indexName: 'productos_electronicos_b2b',
          params: {
            filters: `objectID:${productId} AND (${getVisibilityFilter()}) AND discontinued:false`,
            hitsPerPage: 1
          }
        }]);
        
        if (response.results[0].hits.length > 0) {
          const productData = response.results[0].hits[0];
          setProduct(productData);
          
          // Note: View events are automatically sent by InstantSearch when products appear in search results
          // We don't need to manually send view events here
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, getVisibilityFilter]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner">Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no está disponible.</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const IconComponent = getCategoryIcon(product.categorias_flat);
  const storeData = product.store_data?.[`store_${selectedStore.padStart(3, '0')}`];
  const price = storeData?.price || product.price;
  const stock = storeData?.stock || 0;
  const available = storeData?.available || product.stock;
  const availableAtSelectedStore = product.store_availability?.includes(parseInt(selectedStore));

  const handleAddToCart = () => {
    const productWithStore = {
      ...product,
      selectedStore
    };
    
    // Add to cart with query ID for attribution
    addToCart(productWithStore, quantity, queryID);
    
    // Show some feedback
    alert(`${quantity} x ${product.name} agregado al carrito`);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-breadcrumb">
          <Link to="/">Inicio</Link>
          {product.categorias_flat?.[0] && (
            <>
              <span> / </span>
              <span>{product.categorias_flat[0]}</span>
            </>
          )}
          <span> / </span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-content">
          <div className="product-detail-image">
            <div className="product-image-placeholder">
              <IconComponent size={120} />
            </div>
          </div>

          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.name}</h1>
            <div className="product-detail-sku">SKU: {product.sku || product.objectID}</div>
            
            <div className="product-detail-categories">
              {product.categorias_flat?.map((category, index) => (
                <span key={index} className="category-tag">{category}</span>
              ))}
            </div>

            <div className="product-detail-description">
              <h3>Descripción</h3>
              <p>{product.description || 'Sin descripción disponible.'}</p>
            </div>

            <div className="product-detail-price">
              <div className="price-main">${price?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
              <div className="price-store">Precio en {stores[selectedStore]?.city}</div>
            </div>

            <div className="product-detail-availability">
              {available ? (
                <div className="availability-info">
                  <Package size={20} />
                  <span>En stock: {stock} unidades</span>
                  {availableAtSelectedStore && (
                    <span className="available-badge">Disponible en tu tienda</span>
                  )}
                </div>
              ) : (
                <div className="availability-info out-of-stock">
                  <span>Sin stock</span>
                </div>
              )}
            </div>

            {available && (
              <div className="product-detail-actions">
                <div className="quantity-selector">
                  <label>Cantidad:</label>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
                      <Minus size={16} />
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={stock}
                    />
                    <button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= stock}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <ShoppingCart size={20} />
                  Agregar al Carrito
                </button>
              </div>
            )}

            <div className="product-detail-badges">
              {product.best_seller && <span className="badge best-seller">Best Seller</span>}
              {product.new_product && <span className="badge new-product">Nuevo</span>}
              {product.customer_rating && (
                <span className="badge rating">
                  <Star size={16} weight="fill" />
                  Calificación: {product.customer_rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}; 