import { useNavigate } from 'react-router-dom';
import { Star } from '@phosphor-icons/react';
import { useStore } from '../../context/StoreContext';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { insights } from '../../services/algoliaInsights';

// Carousel Hit Component for homepage
export const CarouselProductHit = ({ hit }) => {
  const { selectedStore, stores } = useStore();
  const navigate = useNavigate();
  const IconComponent = getCategoryIcon(hit.categorias_flat);
  
  const storeData = hit.store_data?.[`store_${selectedStore.padStart(3, '0')}`];
  const price = storeData?.price || hit.price;
  const available = storeData?.available || hit.stock;
  
  // Check if product is available at selected store for badge
  const availableAtSelectedStore = hit.store_availability?.includes(parseInt(selectedStore));

  const handleClick = () => {
    // Track click event - homepage products are not from search, so always use direct click
    insights.clickedObjectIDs(
      'Homepage Product Click',
      'productos_electronicos_b2b',
      [hit.objectID]
    );
    
    navigate(`/producto/${hit.objectID}`);
  };

  return (
    <div className="carousel-card" onClick={handleClick}>
      <div className="card-image-container">
        <div className="card-image-placeholder electronics-gradient">
          <IconComponent size={32} />
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{hit.name}</h3>
        <div className="card-category">{hit.categorias_flat?.[0]}</div>
        <div className="card-sku">SKU: {hit.sku || hit.objectID}</div>
        
        <div className="card-price-section">
          <div className="card-price">${price?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
          <div className="card-store">{stores[selectedStore]?.city}</div>
        </div>
        
        <div className="card-badges">
          {hit.best_seller && <span className="badge best-seller">Best Seller</span>}
          {hit.new_product && <span className="badge new">Nuevo</span>}
          {available && <span className="badge available">Disponible</span>}
          {availableAtSelectedStore && <span className="badge available-store">Disponible en tu tienda</span>}
        </div>
        
        {hit.customer_rating && (
          <div className="card-rating">
            <Star size={12} weight="fill" />
            <span>{hit.customer_rating}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 