import { useState, useEffect } from 'react';
import { useHits } from 'react-instantsearch';
import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';
import { searchClient } from '../../services/algoliaClient';

// Query Suggestions Component using InstantSearch Index
export const QuerySuggestionsFromIndex = ({ onSuggestionSelect }) => {
  const { items } = useHits();

  return (
    <div className="search-section query-suggestions">
      <div className="search-section-header">
        <div className="search-section-title">
          <MagnifyingGlass size={18} />
          <span>Sugerencias</span>
        </div>
      </div>
      {items.length > 0 ? (
        <div className="suggestions-list">
          {items.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-item"
              onClick={() => onSuggestionSelect(suggestion.query)}
            >
              <MagnifyingGlass size={16} />
              <span>{suggestion.query}</span>
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
      ) : (
        <div className="section-placeholder">
          <p>No hay sugerencias disponibles</p>
        </div>
      )}
    </div>
  );
};

// Original Query Suggestions Component (for fallback)
export const QuerySuggestions = ({ query, onSuggestionSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await searchClient.search([{
          indexName: 'productos_electronicos_b2b_query_suggestions',
          params: {
            query,
            hitsPerPage: 5
          }
        }]);
        
        setSuggestions(response.results[0].hits || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(timeoutId);
  }, [query]);

  if (loading || suggestions.length === 0) return null;

  return (
    <div className="search-section query-suggestions">
      <div className="search-section-header">
        <div className="search-section-title">
          <MagnifyingGlass size={18} />
          <span>Sugerencias</span>
        </div>
      </div>
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-item"
            onClick={() => onSuggestionSelect(suggestion.query)}
          >
            <MagnifyingGlass size={16} />
            <span>{suggestion.query}</span>
            <ArrowRight size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}; 