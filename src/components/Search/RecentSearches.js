import { useState, useEffect } from 'react';
import { Clock, ArrowRight } from '@phosphor-icons/react';
import { RecentSearchesManager } from '../../utils/recentSearchesManager';

// Recent Searches Component
export const RecentSearches = ({ onSearchSelect }) => {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    setRecentSearches(RecentSearchesManager.getRecentSearches());
  }, []);

  const handleClearAll = () => {
    RecentSearchesManager.clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div className="search-section recent-searches">
      <div className="search-section-header">
        <div className="search-section-title">
          <Clock size={18} />
          <span>Búsquedas recientes</span>
        </div>
        {recentSearches.length > 0 && (
          <button className="clear-recent" onClick={handleClearAll}>
            Limpiar
          </button>
        )}
      </div>
      {recentSearches.length > 0 ? (
        <div className="recent-searches-list">
          {recentSearches.map((search, index) => (
            <button
              key={index}
              className="recent-search-item"
              onClick={() => onSearchSelect(search)}
            >
              <Clock size={16} />
              <span>{search}</span>
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
      ) : (
        <div className="section-placeholder">
          <p>No hay búsquedas recientes</p>
        </div>
      )}
    </div>
  );
}; 