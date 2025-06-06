import { useState } from 'react';
import { InstantSearch, Configure, useHits, Stats, HitsPerPage, SortBy, Pagination, ClearRefinements, CurrentRefinements, RefinementList, HierarchicalMenu } from 'react-instantsearch';
import { searchClient } from '../../services/algoliaClient';
import { useStore } from '../../context/StoreContext';
import { ProductHit } from '../Search/ProductHit';

// Search Results Page
export const SearchPage = () => {
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [storeFilter, setStoreFilter] = useState(false); // Filter by store availability
  const query = searchParams.get('query') || '';
  const { selectedStore, getVisibilityFilter } = useStore();

  const CustomHits = () => {
    const { items } = useHits();
    
    if (items.length === 0) {
      return (
        <div className="no-search-results">
          <h3>No hay resultados</h3>
          <p>No encontramos productos para "{query}".</p>
        </div>
      );
    }

    return (
      <div className={`results-container ${viewMode}`}>
        {items.map((hit) => (
          <ProductHit key={hit.objectID} hit={hit} showFullDetails={true} />
        ))}
      </div>
    );
  };

  // Build filters based on visibility, discontinued products, and store availability
  const getFilters = () => {
    let filters = `(${getVisibilityFilter()}) AND discontinued:false`;
    
    if (storeFilter) {
      filters += ` AND store_availability:${selectedStore}`;
    }
    
    return filters;
  };

  return (
    <main className="search-page">
      <InstantSearch searchClient={searchClient} indexName="productos_electronicos_b2b" insights={true}>
        <Configure
          query={query}
          filters={getFilters()}
          optionalFilters={[
            `store_availability:${selectedStore}<score=10>`
          ]}
          attributesToRetrieve={['objectID', 'name', 'sku', 'description', 'categorias_flat', 'categorias_hierarquicas.lvl0', 'categorias_hierarquicas.lvl1', 'categorias_hierarquicas.lvl2', 'price', 'store_data', 'stock', 'best_seller', 'new_product', 'customer_rating', 'profit_margin', 'store_availability']}
        />
        
        <div className="search-interface">
          <div className="search-header">
            <div className="search-stats">
              <Stats />
            </div>
          </div>

          <div className="search-controls">
            <div className="search-options">
              <div className="view-toggle">
                <label>Vista:</label>
                <div className="toggle-buttons">
                  <button 
                    className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="1" width="6" height="6" rx="1"/>
                      <rect x="9" y="1" width="6" height="6" rx="1"/>
                      <rect x="1" y="9" width="6" height="6" rx="1"/>
                      <rect x="9" y="9" width="6" height="6" rx="1"/>
                    </svg>
                    Tarjetas
                  </button>
                  <button 
                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="2" y="3" width="12" height="2" rx="1"/>
                      <rect x="2" y="7" width="12" height="2" rx="1"/>
                      <rect x="2" y="11" width="12" height="2" rx="1"/>
                    </svg>
                    Lista
                  </button>
                </div>
              </div>
              
              <div className="hits-per-page">
                <label>Resultados por página:</label>
                <HitsPerPage
                  items={[
                    { label: '12 resultados', value: 12, default: true },
                    { label: '24 resultados', value: 24 },
                    { label: '48 resultados', value: 48 }
                  ]}
                />
              </div>
              
              <div className="sort-by">
                <label>Ordenar por:</label>
                <SortBy
                  items={[
                    { label: 'Relevancia', value: 'productos_electronicos_b2b' },
                    { label: 'Precio: menor a mayor', value: 'productos_electronicos_b2b_price_asc' },
                    { label: 'Precio: mayor a menor', value: 'productos_electronicos_b2b_price_desc' },
                    { label: 'Nombre A-Z', value: 'productos_electronicos_b2b_name_asc' },
                    { label: 'Nombre Z-A', value: 'productos_electronicos_b2b_name_desc' }
                  ]}
                />
              </div>
            </div>
            
            <div className="clear-filters">
              <ClearRefinements
                translations={{
                  resetButtonText: 'Limpiar filtros'
                }}
              />
            </div>
          </div>

          <div className="search-content">
            <aside className="search-sidebar">
              <div className="facets-section">
                <h3>Filtros</h3>
                
                <div className="store-availability-filter">
                  <button 
                    className={`store-filter-btn ${storeFilter ? 'active' : ''}`}
                    onClick={() => setStoreFilter(!storeFilter)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                    </svg>
                    Disponible en mi tienda
                    {storeFilter && (
                      <span className="filter-indicator">✓</span>
                    )}
                  </button>
                </div>
                
                <div className="current-refinements">
                  <CurrentRefinements
                    translations={{
                      clearButtonText: '✕'
                    }}
                  />
                </div>

                <div className="facet-group">
                  <h4>Categorías</h4>
                  <HierarchicalMenu
                    attributes={[
                      'categorias_hierarquicas.lvl0',
                      'categorias_hierarquicas.lvl1', 
                      'categorias_hierarquicas.lvl2'
                    ]}
                    limit={10}
                    showMore={true}
                    showMoreLimit={20}
                    translations={{
                      showMore: 'Ver más',
                      showLess: 'Ver menos'
                    }}
                  />
                </div>

                <div className="facet-group">
                  <h4>Disponibilidad</h4>
                  <RefinementList
                    attribute="best_seller"
                    limit={5}
                    translations={{
                      noRefinementRoot: 'No hay opciones'
                    }}
                    transformItems={(items) =>
                      items.map((item) => ({
                        ...item,
                        label: item.label === 'true' ? 'Best Seller' : 'Producto Regular'
                      }))
                    }
                  />
                </div>

                <div className="facet-group">
                  <h4>Productos Nuevos</h4>
                  <RefinementList
                    attribute="new_product"
                    limit={5}
                    translations={{
                      noRefinementRoot: 'No hay opciones'
                    }}
                    transformItems={(items) =>
                      items.map((item) => ({
                        ...item,
                        label: item.label === 'true' ? 'Producto Nuevo' : 'Producto Establecido'
                      }))
                    }
                  />
                </div>

                <div className="facet-group">
                  <h4>Rango de Precio</h4>
                  <RefinementList
                    attribute="price_range"
                    limit={10}
                    translations={{
                      noRefinementRoot: 'No hay rangos disponibles'
                    }}
                  />
                </div>
              </div>
            </aside>

            <div className="search-results">
              <CustomHits />
              
              <div className="pagination-section">
                <Pagination
                  padding={3}
                  showFirst={false}
                  showLast={false}
                  translations={{
                    previousPageItemText: 'Anterior',
                    nextPageItemText: 'Siguiente'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    </main>
  );
}; 