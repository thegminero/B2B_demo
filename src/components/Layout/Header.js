import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstantSearch, SearchBox, Index, Configure } from 'react-instantsearch';
import {
  Circuitry,
  MagnifyingGlass,
  ShoppingCart,
  CaretDown,
  List,
  MapPin
} from '@phosphor-icons/react';

import { searchClient } from '../../services/algoliaClient';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { RecentSearchesManager } from '../../utils/recentSearchesManager';

import { RecentSearches } from '../Search/RecentSearches';
import { QuerySuggestionsFromIndex } from '../Search/QuerySuggestions';
import { HitsSection } from '../Search/HitsSection';
import { Megamenu } from '../Navigation/Megamenu';
import { CartDropdown } from '../Cart/CartDropdown';

// Header with enhanced search functionality
export const Header = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megamenuOpen, setMegamenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { getCartItemsCount, setIsCartOpen } = useCart();
  const { selectedStore, setSelectedStore, stores, persona, setPersona } = useStore();

  useEffect(() => {
    setDropdownOpen((query !== '' && query.length >= 1) || isFocused);
  }, [query, isFocused]);

  const handleEscKey = (event) => {
    if (event.key === 'Escape') {
      setDropdownOpen(false);
      setQuery('');
      setMegamenuOpen(false);
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const queryHook = useCallback((query, search) => {
    setQuery(query);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      search(query);
    }, 200);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setDropdownOpen(true);
  }
  
  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      if (query === '' || query.length < 1) {
        setDropdownOpen(false);
      }
    }, 200);
  }

  const performSearch = (searchQuery) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      RecentSearchesManager.addSearch(trimmedQuery);
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
      setDropdownOpen(false);
      setQuery('');
      
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
        searchInputRef.current.blur();
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    performSearch(query);
  };

  const handleSearchSelect = (selectedQuery) => {
    performSearch(selectedQuery);
  };

  const handleLogoClick = () => {
    navigate('/');
    setQuery('');
    setDropdownOpen(false);
    setIsFocused(false);
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleStoreChange = (storeId) => {
    setSelectedStore(storeId);
    setUserMenuOpen(false);
  };

  const handlePersonaChange = (newPersona) => {
    setPersona(newPersona);
    setUserMenuOpen(false);
  };
  
  useEffect(() => {
    const inputElement = document.querySelector('.ais-SearchBox-input');
    if (inputElement) {
      searchInputRef.current = inputElement;
      inputElement.addEventListener('focus', handleFocus);
      inputElement.addEventListener('blur', handleBlur);
    }

    const formElement = document.querySelector('.ais-SearchBox-form');
    if (formElement) {
      formElement.addEventListener('submit', handleSubmit);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
        inputElement.removeEventListener('blur', handleBlur);
      }
      if (formElement) {
        formElement.removeEventListener('submit', handleSubmit);
      }
    };
  });

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo" onClick={handleLogoClick}>
          <Circuitry size={28} color="white" />
          <span className="logo-text">ElectroB2B</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-only">
          <button 
            className="nav-button"
            onClick={() => setMegamenuOpen(!megamenuOpen)}
          >
            <List size={18} />
            <span>Categorías</span>
          </button>
        </nav>

        {/* Enhanced Search Section */}
        <div className="header-search">
          <InstantSearch searchClient={searchClient} indexName="productos_electronicos_b2b" insights={true}>
            <div className="enhanced-search-container">
              <SearchBox
                queryHook={queryHook}
                translations={{ placeholder: 'Buscar productos, marcas, categorías...' }}
              />
              <button type="submit" className="search-submit-btn" onClick={handleSubmit}>
                <MagnifyingGlass size={20} weight="bold" />
              </button>
            </div>
            {dropdownOpen && (
              <div className="enhanced-search-dropdown">
                <div className="search-dropdown-content">
                  <div className="search-sections-container">
                    
                    {/* Left Column: Recent Searches & Query Suggestions */}
                    <div className="search-left-column">
                      {/* Recent Searches Section */}
                      <div className="search-section-wrapper">
                        <RecentSearches onSearchSelect={handleSearchSelect} />
                      </div>

                      {/* Query Suggestions Section */}
                      <div className="search-section-wrapper">
                        {query && query.length >= 2 ? (
                          <Index indexName="productos_electronicos_b2b_query_suggestions">
                            <Configure
                              query={query}
                              hitsPerPage={5}
                            />
                            <QuerySuggestionsFromIndex onSuggestionSelect={handleSearchSelect} />
                          </Index>
                        ) : (
                          <div className="search-section query-suggestions">
                            <div className="search-section-header">
                              <div className="search-section-title">
                                <MagnifyingGlass size={18} />
                                <span>Sugerencias</span>
                              </div>
                            </div>
                            <div className="section-placeholder">
                              <p>Escribe para ver sugerencias</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Products */}
                    <div className="search-right-column">
                      {query && query.length >= 2 ? (
                        <Index indexName="productos_electronicos_b2b">
                          <HitsSection
                            title="Productos"
                            query={query}
                          />
                        </Index>
                      ) : (
                        <div className="search-section products-section">
                          <div className="search-section-header">
                            <div className="search-section-title">
                              <Circuitry size={18} />
                              <span>Productos</span>
                            </div>
                          </div>
                          <div className="section-placeholder">
                            <div className="empty-products-state">
                              <Circuitry size={48} />
                              <h4>Busca productos</h4>
                              <p>Encuentra componentes electrónicos, computadoras y accesorios</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}
          </InstantSearch>
        </div>

        {/* Actions Section */}
        <div className="header-actions">
          {/* Cart Button */}
          <button className="action-button cart-action" onClick={handleCartClick}>
            <ShoppingCart size={22} />
            {getCartItemsCount() > 0 && (
              <span className="action-badge">{getCartItemsCount()}</span>
            )}
          </button>

          {/* User Menu Button */}
          <button className="action-button user-action" onClick={handleUserMenuToggle}>
            <div className="user-avatar">
              {persona === 'wholesale' ? '🏢' : '👤'}
            </div>
            <CaretDown size={14} className={`user-caret ${userMenuOpen ? 'open' : ''}`} />
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="action-button mobile-menu-button mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <List size={22} />
          </button>
        </div>

        {/* User Dropdown Menu */}
        {userMenuOpen && (
          <div className="user-dropdown">
            <div className="user-dropdown-header">
              <div className="user-info">
                <div className="user-avatar large">
                  {persona === 'wholesale' ? '🏢' : '👤'}
                </div>
                <div>
                  <div className="user-type">{persona === 'wholesale' ? 'Mayorista' : 'Cliente Público'}</div>
                  <div className="user-store">{stores[selectedStore]?.name}</div>
                </div>
              </div>
            </div>

            <div className="user-dropdown-section">
              <h4>Tipo de Usuario</h4>
              <div className="persona-options">
                <button 
                  className={`persona-option ${persona === 'public' ? 'active' : ''}`}
                  onClick={() => handlePersonaChange('public')}
                >
                  <span className="persona-icon">👤</span>
                  <div>
                    <div className="persona-name">Cliente Público</div>
                    <div className="persona-desc">Productos públicos</div>
                  </div>
                </button>
                <button 
                  className={`persona-option ${persona === 'wholesale' ? 'active' : ''}`}
                  onClick={() => handlePersonaChange('wholesale')}
                >
                  <span className="persona-icon">🏢</span>
                  <div>
                    <div className="persona-name">Mayorista</div>
                    <div className="persona-desc">Productos públicos y mayoristas</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="user-dropdown-section">
              <h4>Tienda</h4>
              <div className="store-options">
                {Object.entries(stores).map(([storeId, store]) => (
                  <button
                    key={storeId}
                    className={`store-option ${selectedStore === storeId ? 'active' : ''}`}
                    onClick={() => handleStoreChange(storeId)}
                  >
                    <MapPin size={16} />
                    <div>
                      <div className="store-name">{store.name}</div>
                      <div className="store-address">{store.city}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <button 
                className="mobile-menu-item"
                onClick={() => {
                  setMegamenuOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <List size={20} />
                <span>Categorías</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay for dropdowns */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div 
          className="header-overlay" 
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}

      <Megamenu isOpen={megamenuOpen} setIsOpen={setMegamenuOpen} />
      <CartDropdown />
    </header>
  );
}; 