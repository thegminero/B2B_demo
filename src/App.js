import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import { Header } from './components/Layout/Header';
import { Footer } from './components/Footer/Footer';

// Page Components
import { Home } from './components/Pages/Home';
import { SearchPage } from './components/Pages/SearchPage';
import { CategoryPage } from './components/Pages/CategoryPage';
import { ProductDetailPage } from './components/Pages/ProductDetailPage';
import { CartPage } from './components/Pages/CartPage';
import { ThankYouPage } from './components/Pages/ThankYouPage';

// Main App Component
function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/categoria/:categoryId" element={<CategoryPage />} />
              <Route path="/producto/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </StoreProvider>
  );
}

export default App; 