import { TrendUp, Lightning, Star, Package } from '@phosphor-icons/react';
import { CarouselSection } from '../Product/CarouselSection';

// Home Page
export const Home = () => {
  return (
    <main className="main-content">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Catálogo de Productos Electrónicos B2B</h1>
          <p>Encuentra los mejores productos electrónicos para tu empresa con precios preferenciales y disponibilidad en tiempo real</p>
        </div>
      </div>
      
      <CarouselSection
        title="Productos Más Vendidos"
        Icon={TrendUp}
      />
      
      <CarouselSection
        title="Nuevos Productos"
        Icon={Lightning}
      />
      
      <CarouselSection
        title="Productos Destacados"
        Icon={Star}
      />
      
      <CarouselSection
        title="Disponibles en tu Tienda"
        Icon={Package}
      />
    </main>
  );
}; 