// Recent Searches Manager
export class RecentSearchesManager {
  static STORAGE_KEY = 'electrob2b_recent_searches';
  static MAX_SEARCHES = 5;

  static getRecentSearches() {
    try {
      const searches = localStorage.getItem(this.STORAGE_KEY);
      return searches ? JSON.parse(searches) : [];
    } catch {
      return [];
    }
  }

  static addSearch(query) {
    if (!query || query.trim().length < 2) return;
    
    const searches = this.getRecentSearches();
    const normalizedQuery = query.trim().toLowerCase();
    
    // Remove existing occurrence
    const filtered = searches.filter(search => search.toLowerCase() !== normalizedQuery);
    
    // Add to beginning
    const updated = [query.trim(), ...filtered].slice(0, this.MAX_SEARCHES);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Handle storage errors gracefully
    }
  }

  static clearRecentSearches() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // Handle storage errors gracefully
    }
  }
} 