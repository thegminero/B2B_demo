import './App.css';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Index, Configure, useHits } from 'react-instantsearch';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  FilmStrip,
  Pizza,
  ShoppingCart,
  Television,
  Gear,
  WifiHigh,
  
} from '@phosphor-icons/react';

const searchClient = algoliasearch('MWN8IH23ME', '4e648074863f9356162d9db95a19efe0');

// Hit components for each index
const PeliculasHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div className="dropdown-item" onMouseDown={() => navigate(`/search?query=${hit.NOMBRE_COMERCIAL}`)}>
      <h3>{hit.NOMBRE_COMERCIAL}</h3>
    </div>
  );
};

const FoodHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div className="dropdown-item" onMouseDown={() => navigate(`/search?query=${hit.name}`)}>
      <h3>{hit.name}</h3>
    </div>
  );
};

const ShopHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div className="dropdown-item" onMouseDown={() => navigate(`/search?query=${hit.name}`)}>
      <img src={hit.imageGroups?.[0]?.images?.[0]?.disBaseLink} alt={hit.name} />
      <h3>{hit.name}</h3>
    </div>
  );
};

const CanalesHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div className="dropdown-item" onMouseDown={() => navigate(`/search?query=${hit.nombre}`)}>
      <h3>{hit.nombre}</h3>
    </div>
  );
};

const ServicionsHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div className="dropdown-item" onMouseDown={() => navigate(`/search?query=${hit.nombre}`)}>
      <h3>{hit.nombre}</h3>
    </div>
  );
};

const TotalPlayHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div className="dropdown-item" onMouseDown={() => navigate(`/search?query=${hit.nombrePaquete}`)}>
      <h3>{hit.nombrePaquete}</h3>
      {hit.megas && <span className="pill">{hit.megas} MB</span>}
    </div>
  );
};

// CustomHits component with conditional rendering based on hits count
function CustomHits({ HitComponent, setVisible }) {
  const { items } = useHits();

  useEffect(() => {
    setVisible(items.length > 0); // Update visibility based on hits count
  }, [items, setVisible]);

  if (items.length === 0) return null;

  return (
    <div className="hits-container">
      {items.map((hit) => (
        <div key={hit.objectID}>
          <HitComponent hit={hit} />
        </div>
      ))}
    </div>
  );
}

// Section component with an icon
const HitsSection = ({ indexName, title, Icon, HitComponent }) => {
  const [visible, setVisible] = useState(true);

  return (
    <Index indexName={indexName}>
      <Configure hitsPerPage={3} />
      {visible && (
        <div className="dropdown-section">
          <h2>
            <Icon size={20} style={{ marginRight: '0.5rem' }} />
            {title}
          </h2>
          <CustomHits HitComponent={HitComponent} setVisible={setVisible} />
          <div className="view-all">
            <a href={`/search?index=${indexName}`} onClick={(e) => e.stopPropagation()}>
              Ver todos
            </a>
          </div>
        </div>
      )}
    </Index>
  );
};

const Header = ({ dropdownOpen, setDropdownOpen }) => {
  const [query, setQuery] = useState('');

  const handleEscKey = (event) => {
    if (event.key === 'Escape') {
      setDropdownOpen(false);
      setQuery(''); 
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [handleEscKey]);

  return (
    <header className="header">
      <div className="header-content">
        <img
          src="https://www.totalplay.com.mx/assets/img/nuevos/totalplay-logoWhite.svg"
          alt="Totalplay Logo"
          className="logo"
        />
        <InstantSearch searchClient={searchClient}>
          <div
            className="search-box-container"
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setDropdownOpen(false)}
          >
            <SearchBox
              value={query}
              translations={{ placeholder: 'Search for products...' }}
            />
            <span className="search-icon">&#128269;</span>
          </div>
          {dropdownOpen && (
            <div className="dropdown show">
              <HitsSection indexName="demo_peliculas" title="Peliculas" Icon={FilmStrip} HitComponent={PeliculasHit} />
              <HitsSection indexName="demo_food" title="Comida" Icon={Pizza} HitComponent={FoodHit} />
              <HitsSection indexName="demo_shop" title="Tienda" Icon={ShoppingCart} HitComponent={ShopHit} />
              <HitsSection indexName="demo_canales" title="Canales" Icon={Television} HitComponent={CanalesHit} />
              <HitsSection indexName="demo_servicions" title="Servicios" Icon={Gear} HitComponent={ServicionsHit} />
              <HitsSection indexName="demo_totalplay" title="Total Play" Icon={WifiHigh} HitComponent={TotalPlayHit} />
            </div>
          )}
        </InstantSearch>
      </div>
    </header>
  );
};


const Footer = () => (
  <footer className="footer">
    <p>© 2023 My Shop. All rights reserved.</p>
  </footer>
);

// Carousel Hit components for each index
const PeliculasCarouselHit = ({ hit }) => (
  <div className="carousel-item">
    <h3>{hit.NOMBRE_COMERCIAL}</h3>
  </div>
);

const FoodCarouselHit = ({ hit }) => (
  <div className="carousel-item">
    <h3>{hit.name}</h3>
  </div>
);

const ShopCarouselHit = ({ hit }) => (
  <div className="carousel-item">
    <img src={hit.imageGroups?.[0]?.images?.[0]?.disBaseLink} alt={hit.name} />
    <h3>{hit.name}</h3>
  </div>
);

const CarouselSection = ({ indexName, title, Icon, HitComponent, ruleContexts, analyticsTags }) => {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Index indexName={indexName}>
      <Configure hitsPerPage={10} query="" ruleContexts={ruleContexts} analyticsTags={analyticsTags} />
      <section className="carousel-section">
        <h2>
          <Icon size={20} style={{ marginRight: '0.5rem' }} />
          {title}
        </h2>
        <div className="carousel-container">
          <button className="carousel-button left" onClick={() => scrollCarousel('left')}>
            &#9664;
          </button>
          <div className="carousel" ref={carouselRef}>
            <Hits hitComponent={HitComponent} />
          </div>
          <button className="carousel-button right" onClick={() => scrollCarousel('right')}>
            &#9654;
          </button>
        </div>
      </section>
    </Index>
  );
};

const Home = () => (
  <main className="main-content">
    <InstantSearch searchClient={searchClient}>
      <CarouselSection ruleContexts={["homepromo"]} analyticsTags={["carousel", "peliculas"]} indexName="demo_peliculas" title="Peliculas" Icon={FilmStrip} HitComponent={PeliculasCarouselHit} />
      <CarouselSection ruleContexts={["homepromo"]} analyticsTags={["carousel", "comida"]} indexName="demo_food" title="Tienes Hambre?" Icon={Pizza} HitComponent={FoodCarouselHit} />
      <CarouselSection ruleContexts={["homepromo"]} analyticsTags={["carousel", "compra"]} indexName="demo_shop" title="Compra en Linea" Icon={ShoppingCart} HitComponent={ShopCarouselHit} />
    </InstantSearch>
  </main>
);

function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Router>
      <div className="app">
        <Header dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
