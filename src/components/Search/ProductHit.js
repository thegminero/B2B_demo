import { useNavigate } from 'react-router-dom';
import { useInstantSearch } from 'react-instantsearch';
import { Circuitry, Package, Star } from '@phosphor-icons/react';
import { useStore } from '../../context/StoreContext';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { insights } from '../../services/algoliaInsights';

// Product Hit Components
export const ProductHit = ({ hit, showFullDetails = false }) => {
  const { selectedStore, stores } = useStore();
  const { results } = useInstantSearch();
  const navigate = useNavigate();
  
  // Get store-specific data
  const storeData = hit.store_data?.[`store_${selectedStore.padStart(3, '0')}`];
  const price = storeData?.price || hit.price;
  const stock = storeData?.stock || 0;
  const available = storeData?.available || hit.stock;
  
  // Check if product is available at selected store for badge
  const availableAtSelectedStore = hit.store_availability?.includes(parseInt(selectedStore));

  const handleClick = (e) => {
    e.preventDefault();
    
    // Track click event
    const queryID = results?.queryID;
    const position = hit.__position;
    
    if (queryID) {
      insights.clickedObjectIDsAfterSearch(
        'Product Click',
        'productos_electronicos_b2b',
        [hit.objectID],
        [position],
        queryID
      );
    } else {
      insights.clickedObjectIDs(
        'Product Click - Direct',
        'productos_electronicos_b2b',
        [hit.objectID]
      );
    }
    
    navigate(`/producto/${hit.objectID}?queryID=${queryID || ''}`);
  };

  return (
    <div className={`product-hit ${showFullDetails ? 'detailed' : ''}`} onClick={handleClick}>
      <div className="product-image">
        <Circuitry size={showFullDetails ? 48 : 32} />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{hit.name}</h3>
        <div className="product-sku">SKU: {hit.sku || hit.objectID}</div>
        
        {showFullDetails && (
          <div className="product-description">{hit.description}</div>
        )}
        
        <div className="product-categories">
          {hit.categorias_flat?.slice(0, 2).map((category, index) => (
            <span key={index} className="category-tag">{category}</span>
          ))}
        </div>
        
        <div className="product-details">
          <div className="price-section">
            <span className="price">${price?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            <span className="store-info">en {stores[selectedStore]?.city}</span>
          </div>
          
          <div className="availability-section">
            {available ? (
              <span className="in-stock">
                <Package size={14} />
                Stock: {stock}
              </span>
            ) : (
              <span className="out-of-stock">Sin stock</span>
            )}
          </div>
        </div>
        
        <div className="product-badges">
          {hit.best_seller && <span className="badge best-seller">Best Seller</span>}
          {hit.new_product && <span className="badge new-product">Nuevo</span>}
          {availableAtSelectedStore && <span className="badge available-store">Disponible en tu tienda</span>}
          {hit.customer_rating && (
            <span className="badge rating">
              <Star size={12} weight="fill" />
              {hit.customer_rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Dropdown Hit Component for search suggestions
export const DropdownProductHit = ({ hit }) => {
  const { selectedStore } = useStore();
  const { results } = useInstantSearch();
  const navigate = useNavigate();
  const IconComponent = getCategoryIcon(hit.categorias_flat);
  
  const storeData = hit.store_data?.[`store_${selectedStore.padStart(3, '0')}`];
  const price = storeData?.price || hit.price;

  const handleClick = () => {
    // Track click event
    const queryID = results?.queryID;
    const position = hit.__position;
    
    if (queryID) {
      insights.clickedObjectIDsAfterSearch(
        'Product Click',
        'productos_electronicos_b2b',
        [hit.objectID],
        [position],
        queryID
      );
    }
    
    navigate(`/producto/${hit.objectID}?queryID=${queryID || ''}`);
  };

  return (
    <div className="dropdown-item" onMouseDown={handleClick}>
      <div className="product-icon">
        <IconComponent size={24} />
      </div>
      <div className="product-details">
        <h3>{hit.name}</h3>
        <div className="product-meta">
          <span className="sku">SKU: {hit.sku || hit.objectID}</span>
          <span className="price">${price?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="product-categories">
          {hit.categorias_flat?.[0]}
        </div>
      </div>
    </div>
  );
}; 