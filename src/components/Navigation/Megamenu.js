import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/categories';

// Megamenu Component
export const Megamenu = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/categoria/${categoryId}`);
    setIsOpen(false);
  };

  const handleSubcategoryClick = (categoryId, subcategory) => {
    navigate(`/categoria/${categoryId}?subcategory=${encodeURIComponent(subcategory)}`);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="megamenu-overlay" onClick={() => setIsOpen(false)}>
      <div className="megamenu" onClick={(e) => e.stopPropagation()}>
        <div className="megamenu-content">
          <div className="megamenu-header">
            <h3>Categorías de Productos</h3>
            <button className="megamenu-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="megamenu-grid">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="megamenu-category">
                  <div 
                    className="category-header"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <IconComponent size={24} />
                    <h4>{category.name}</h4>
                  </div>
                  
                  <ul className="subcategory-list">
                    {category.subcategories.map((subcategory, index) => (
                      <li key={index}>
                        <button 
                          onClick={() => handleSubcategoryClick(category.id, subcategory)}
                          className="subcategory-link"
                        >
                          {subcategory}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 