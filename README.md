# ElectroB2B - Algolia B2B E-commerce Demo

A comprehensive B2B electronics e-commerce demo showcasing advanced Algolia search capabilities with React InstantSearch.

## 🎯 Demo Overview

This application demonstrates a complete B2B electronics marketplace with sophisticated search, filtering, and e-commerce functionality powered by Algolia. The demo showcases how modern search-driven commerce experiences can be built for B2B scenarios with features like multi-store inventory, persona-based pricing, and hierarchical category navigation.

## 🚀 Key Features

### Search & Discovery
- **Instant Search**: Real-time search with autocomplete and suggestions
- **Advanced Autocomplete**: Query suggestions from dedicated suggestion index
- **Recent Searches**: Persistent user search history
- **Smart Hits Preview**: Product previews in search dropdown
- **Multi-Column Search Layout**: Organized search results display

### Navigation & Filtering
- **Hierarchical Categories**: Navigate through nested category levels (lvl0 → lvl1 → lvl2)
- **Advanced Faceting**: Filter by categories, price ranges, availability, and product features
- **Smart Sorting**: Multiple sort options (relevance, price, name, etc.)
- **Store-Specific Filtering**: Filter products by store availability
- **Current Refinements**: Clear view and management of applied filters

### B2B-Specific Features
- **Multi-Store Support**: Different inventory and pricing per store location
- **Persona-Based Experience**: Separate public and wholesale product catalogs
- **Store Context**: Location-aware pricing and inventory
- **Bulk Operations**: Quantity selectors and cart management

### E-commerce Functionality
- **Product Detail Pages**: Comprehensive product information with store-specific data
- **Shopping Cart**: Full cart management with quantity updates and removal
- **Add to Cart**: Support for multiple quantities with stock validation
- **Order Completion**: Complete purchase flow with order summary
- **Responsive Design**: Mobile-optimized interface

### Analytics & Insights
- **Algolia Insights Integration**: Complete event tracking for analytics
- **Click Tracking**: Monitor user interactions with search results
- **Conversion Tracking**: Track add-to-cart and purchase events
- **Search Analytics**: Automatic search performance monitoring
- **Attribution**: Link conversions back to originating searches

## 🔧 Algolia Integration Details

### Search Indices
- **Primary Index**: `productos_electronicos_b2b` - Main product catalog
- **Query Suggestions**: `productos_electronicos_b2b_query_suggestions` - Search suggestions
- **Sorting Indices**: Multiple replica indices for different sort orders

### Search Features Implemented
- **InstantSearch React**: Complete React InstantSearch implementation
- **SearchBox**: Custom search input with debouncing
- **Hits**: Product results with custom rendering
- **HierarchicalMenu**: Multi-level category navigation
- **RefinementList**: Faceted filtering for various attributes
- **Stats**: Search result statistics
- **Pagination**: Paginated results navigation
- **SortBy**: Multiple sorting options
- **CurrentRefinements**: Active filter management

### Data Structure
```json
{
  "objectID": "unique-product-id",
  "name": "Product Name",
  "sku": "PRODUCT-SKU",
  "description": "Product description",
  "categorias_flat": ["Category 1", "Category 2"],
  "categorias_hierarquicas.lvl0": "Electronics",
  "categorias_hierarquicas.lvl1": "Electronics > Computers",  
  "categorias_hierarquicas.lvl2": "Electronics > Computers > Laptops",
  "price": 1299.99,
  "stock": 25,
  "store_data": {
    "store_001": {
      "price": 1249.99,
      "stock": 15,
      "available": true
    }
  },
  "store_availability": [1, 2, 3],
  "visibility": ["public", "wholesale"],
  "best_seller": true,
  "new_product": false,
  "customer_rating": 4.2,
  "discontinued": false
}
```

### Insights Events Tracked
- **View Events**: Automatic when products appear in search results
- **Click Events**: When users click on search results
- **Add to Cart Events**: When products are added to cart
- **Purchase Events**: When orders are completed
- **Attribution**: Links conversions back to original search queries

## 🛠️ Technical Stack

- **React 18**: Modern React with hooks and context
- **React Router**: Client-side routing
- **React InstantSearch**: Official Algolia React library
- **Algolia Search**: Core search functionality
- **Algolia Insights**: Analytics and tracking
- **Phosphor Icons**: Icon library
- **CSS Modules**: Scoped styling
- **Context API**: State management for cart and store selection

## 📦 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Algolia account with configured indices

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd total-play-demo/totalplayDemo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Algolia credentials**
   
   Update `src/services/algoliaClient.js` with your Algolia credentials:
   ```javascript
   export const ALGOLIA_APP_ID = 'your-app-id';
   export const ALGOLIA_SEARCH_API_KEY = 'your-search-api-key';
   export const ALGOLIA_INSIGHTS_API_KEY = 'your-insights-api-key';
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Required Algolia Index Configuration

Your Algolia indices should include the following attributes:

**Searchable Attributes:**
- `name`
- `description`
- `sku`
- `categorias_flat`

**Facets:**
- `categorias_flat`
- `categorias_hierarquicas.lvl0`
- `categorias_hierarquicas.lvl1`
- `categorias_hierarquicas.lvl2`
- `best_seller`
- `new_product`
- `price_range`
- `store_availability`
- `visibility`
- `discontinued`

**Custom Ranking:**
- `desc(best_seller)`
- `desc(customer_rating)`
- `desc(profit_margin)`

## 💡 Usage Guide

### Basic Search
1. Use the main search bar to find products
2. See instant results and suggestions as you type
3. Click on suggestions or products to navigate

### Category Navigation
1. Click "Categorías" to open the mega menu
2. Browse hierarchical categories
3. Use category pages for focused browsing

### Filtering & Sorting
1. Use the sidebar filters on search and category pages
2. Apply multiple filters simultaneously
3. Sort results by various criteria
4. Clear individual filters or all at once

### Store & Persona Selection
1. Click the user menu to switch between stores
2. Toggle between public and wholesale personas
3. See different pricing and availability based on context

### Shopping Cart
1. Add products from search results or detail pages
2. Adjust quantities in the cart
3. Complete purchases to see order confirmation

## 🎨 Customization

### Styling
- CSS files are located in `src/styles/`
- Component-specific styles are inline or in component directories
- Modify colors, fonts, and layouts in the CSS files

### Adding New Features
- Search components are in `src/components/Search/`
- Page components are in `src/components/Pages/`
- Utility functions are in `src/utils/`

### Data Management
- Store configuration in `src/context/StoreContext.js`
- Cart functionality in `src/context/CartContext.js`
- Category definitions in `src/data/categories.js`

## 📊 Analytics Dashboard

When properly configured, this demo provides rich analytics data in your Algolia dashboard:

- **Search Analytics**: Query performance, no-results queries, popular searches
- **Click Analytics**: Click-through rates, position analytics
- **Conversion Analytics**: Add-to-cart and purchase conversion rates
- **A/B Testing**: Ready for search optimization experiments

## 🔍 Demo Scenarios

### B2B Search Experience
1. **Product Discovery**: Search for "laptop" to see instant results
2. **Category Navigation**: Explore nested categories like "Electronics > Computers > Laptops"
3. **Filtering**: Filter by store availability, price range, or product features
4. **Store Context**: Switch stores to see different pricing and inventory

### E-commerce Flow
1. **Search to Purchase**: Search → Filter → Product Detail → Add to Cart → Checkout
2. **Category Browsing**: Categories → Product Detail → Purchase
3. **Cart Management**: Add multiple products, adjust quantities, complete purchase

### Analytics Demonstration
1. Perform various searches and interactions
2. Check Algolia dashboard for real-time analytics
3. View conversion attribution and user behavior patterns

## 🤝 Contributing

This is a demo application showcasing Algolia capabilities. For questions or improvements:

1. Review the existing code structure
2. Test changes thoroughly with different search scenarios
3. Ensure Algolia events are properly tracked
4. Maintain responsive design principles

## 📄 License

This project is a demonstration application. Please check with your organization's policies before using in production environments.

---

**Built with ❤️ using Algolia InstantSearch**
