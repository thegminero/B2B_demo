import { Link } from 'react-router-dom';
import { useHits, Configure } from 'react-instantsearch';
import { Circuitry, ArrowRight } from '@phosphor-icons/react';
import { DropdownProductHit } from './ProductHit';
import { useStore } from '../../context/StoreContext';

// Enhanced Hits Section with Store-based filtering
export const HitsSection = ({ title, query }) => {
  const { items } = useHits();
  const { selectedStore, getVisibilityFilter } = useStore();

  return (
    <div className="search-section products-section">
      <div className="search-section-header">
        <div className="search-section-title">
          <Circuitry size={18} />
          <span>{title}</span>
        </div>
      </div>
      <Configure
        query={query || ''}
        hitsPerPage={6}
        filters={`(${getVisibilityFilter()}) AND discontinued:false`}
        optionalFilters={[`store_availability:${selectedStore}`]}
        attributesToRetrieve={['objectID', 'name', 'sku', 'description', 'categorias_flat', 'categorias_hierarquicas.lvl0', 'categorias_hierarquicas.lvl1', 'categorias_hierarquicas.lvl2', 'price', 'store_data', 'stock', 'best_seller', 'new_product', 'customer_rating', 'store_availability']}
      />
      <div className="products-grid">
        {query && query.trim() !== '' ? (
          items.length > 0 ? (
            items.map((hit) => (
              <div key={hit.objectID}>
                <DropdownProductHit hit={hit} />
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron productos para "{query}"</p>
            </div>
          )
        ) : (
          <div className="section-placeholder">
            <div className="empty-products-state">
              <Circuitry size={48} />
              <h4>Busca productos</h4>
              <p>Encuentra componentes electrónicos, computadoras y accesorios</p>
            </div>
          </div>
        )}
      </div>
      {items.length > 0 && query && query.trim() !== '' && (
        <div className="view-all-section">
          <Link to={`/search?query=${encodeURIComponent(query || '')}`} className="view-all-link">
            Ver todos los resultados ({items.length}+)
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}; 