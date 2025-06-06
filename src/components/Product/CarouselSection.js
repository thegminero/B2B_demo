import { useRef } from 'react';
import { InstantSearch, Configure, Hits } from 'react-instantsearch';
import { searchClient } from '../../services/algoliaClient';
import { useStore } from '../../context/StoreContext';
import { CarouselProductHit } from './CarouselProductHit';

// Carousel Section with store-based configuration
export const CarouselSection = ({ title, Icon }) => {
  const carouselRef = useRef(null);
  const { selectedStore, getVisibilityFilter } = useStore();

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
          <InstantSearch searchClient={searchClient} indexName="productos_electronicos_b2b">
            <Configure
              hitsPerPage={10}
              filters={`(${getVisibilityFilter()}) AND discontinued:false`}
              optionalFilters={[
                `store_availability:${selectedStore}<score=10>`
              ]}
            />
            <Hits hitComponent={CarouselProductHit} />
          </InstantSearch>
        </div>
        <button className="carousel-button right" onClick={() => scrollCarousel('right')}>
          &#9654;
        </button>
      </div>
    </section>
  );
}; 