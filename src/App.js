import './App.css';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Index, Configure, useHits } from 'react-instantsearch';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

const searchClient = algoliasearch('MWN8IH23ME', '4e648074863f9356162d9db95a19efe0');

// Hit components for each index
const PeliculasHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div
      className="dropdown-item"
      onMouseDown={() => navigate(`/search?query=${hit.NOMBRE_COMERCIAL}`)}
    >
      <h3>{hit.NOMBRE_COMERCIAL}</h3>
    </div>
  );
};

const FoodHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div
      className="dropdown-item"
      onMouseDown={() => navigate(`/search?query=${hit.name}`)}
    >
      <h3>{hit.name}</h3>
    </div>
  );
};

const ShopHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div
      className="dropdown-item"
      onMouseDown={() => navigate(`/search?query=${hit.name}`)}
    >
      <img src={hit.imageGroups?.[0]?.images?.[0]?.disBaseLink} alt={hit.name} />
      <h3>{hit.name}</h3>
    </div>
  );
};

const CanalesHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div
      className="dropdown-item"
      onMouseDown={() => navigate(`/search?query=${hit.nombre}`)}
    >
      <h3>{hit.nombre}</h3>
      
    </div>
  );
};


const ServicionsHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div
      className="dropdown-item"
      onMouseDown={() => navigate(`/search?query=${hit.nombre}`)}
    >
      <h3>{hit.nombre}</h3>
    </div>
  );
};


const TotalPlayHit = ({ hit }) => {
  const navigate = useNavigate();
  return (
    <div
      className="dropdown-item"
      onMouseDown={() => navigate(`/search?query=${hit.nombrePaquete}`)}
    >
      <h3>{hit.nombrePaquete}</h3>
      {hit.nombrePaquete && <span className="pill">{hit.megas} MB</span>}
    </div>
  );
};

// Custom hits component that checks for hits and renders them
function CustomHits({ HitComponent }) {
  const { items, sendEvent } = useHits();

  // Render nothing if there are no items
  if (items.length === 0) return null;

  return (
    <div className="hits-container">
      {items.map((hit) => (
        <div
          key={hit.objectID}
          onClick={() => sendEvent('click', hit, 'Hit Clicked')}
          onAuxClick={() => sendEvent('click', hit, 'Hit Clicked')}
        >
          <HitComponent hit={hit} />
        </div>
      ))}
    </div>
  );
}

// Section component to render hits for an index only if there are results
const HitsSection = ({ indexName, title, HitComponent }) => (
  <Index indexName={indexName}>
    <Configure hitsPerPage={3} />
    <div className="dropdown-section">
      <h2>{title}</h2>
      <CustomHits HitComponent={HitComponent} />
      {/* "Ver todos" link */}
      <div className="view-all">
        <a href={`/search?index=${indexName}`} onClick={(e) => e.stopPropagation()}>
          Ver todos
        </a>
      </div>
    </div>
  </Index>
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

const CarouselSection = ({ indexName, title, HitComponent, ruleContexts, analyticsTags }) => {
  const carouselRef = useRef(null);

  // Scroll the carousel left or right
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth; // Scroll by carousel width
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Index indexName={indexName}>
      {/* Configure component with unique rulesContext and analyticsTags */}
      <Configure
        hitsPerPage={10}
        query=""
        ruleContexts={ruleContexts}
        analyticsTags={analyticsTags}
      />
      <section className="carousel-section">
        <h2>{title}</h2>
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


const Header = ({ dropdownOpen, setDropdownOpen }) => {
  return (
    <header className="header">
      <div className="header-content">
        <img
          src="https://www.totalplay.com.mx/assets/img/nuevos/totalplay-logoWhite.svg"
          alt="Totalplay Logo"
          className="logo"
        />
        
        <InstantSearch searchClient={searchClient} >
          <div
            className="search-box-container"
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setDropdownOpen(false)}
          >
            <SearchBox
              translations={{ placeholder: 'Search for products...' }}
              submitIconComponent={() => null}  // Removes default submit icon
              resetIconComponent={() => null}   // Removes default clear icon
            />
            <span className="search-icon">&#128269;</span>
          </div>
          {dropdownOpen && (
            <div className="dropdown show">
              {/* Peliculas Section */}
              <HitsSection indexName="demo_peliculas" title="Peliculas" HitComponent={PeliculasHit} />
              
              {/* Food Section */}
              <HitsSection indexName="demo_food" title="Comida" HitComponent={FoodHit} />

              {/* Shop Section */}
              <HitsSection indexName="demo_shop" title="Tienda" HitComponent={ShopHit} />

              {/* Canales Section */}
              <HitsSection indexName="demo_canales" title="Canales" HitComponent={CanalesHit} />
              
              {/* Servicios Section */}
              <HitsSection indexName="demo_servicions" title="Servicios" HitComponent={ServicionsHit} />

              {/* TotalPlay Section */}
              <HitsSection indexName="demo_totalplay" title="Total Play" HitComponent={TotalPlayHit} />
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


const Home = () => (
  <main className="main-content">

    <InstantSearch searchClient={searchClient} >
      
      {/* Peliculas Carousel */}
      <CarouselSection ruleContexts={["homepromo"]} analyticsTags={["carousel", "peliculas"]} 
      indexName="demo_peliculas" title="Peliculas" HitComponent={PeliculasCarouselHit} />
      
      {/* Food Carousel */}
      <CarouselSection ruleContexts={["homepromo"]} analyticsTags={["carousel", "comida"]} 
        indexName="demo_food" title="Tienes Hambre?" HitComponent={FoodCarouselHit} />
      
      {/* Shop Carousel */}
      <CarouselSection ruleContexts={["homepromo"]} analyticsTags={["carousel", "compra"]} 
        indexName="demo_shop" title="Compra en Linea" HitComponent={ShopCarouselHit} />
      
      {/* Add other carousel sections here as needed */}
    </InstantSearch>
  </main>
);


const SearchPage = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const query = queryParams.get('query');

  return (
    <main className="main-content">
      <h2>Search Results for "{query}"</h2>
      {/* Render search results here based on query */}
    </main>
  );
};

function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Router>
      <div className="app">
        <Header dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
