import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { menuData } from '../utils/data';
import FilterSidebar from '../components/FilterSidebar';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';

const HomePage = ({ addToCart, addToFavorites, removeFromFavorites, favorites }) => {
  const [filters, setFilters] = useState({
    categories: [],
    maxPrice: 1000,
    minRating: 0,
    onlyAvailable: false,
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const [filteredItems, setFilteredItems] = useState(menuData);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let items = [...menuData];

    // Фильтрация по поиску
    if (debouncedSearch) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Фильтрация по категориям
    if (filters.categories.length > 0) {
      items = items.filter(item => filters.categories.includes(item.category));
    }

    // Фильтрация по цене
    items = items.filter(item => item.price <= filters.maxPrice);

    // Фильтрация по рейтингу
    if (filters.minRating > 0) {
      items = items.filter(item => item.rating >= filters.minRating);
    }

    // Фильтрация по доступности
    if (filters.onlyAvailable) {
      items = items.filter(item => item.available);
    }

    // Сортировка
    items.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (filters.sortBy === 'rating') {
        comparison = b.rating - a.rating;
      } else if (filters.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(items);
  }, [filters, debouncedSearch]);

  const isFavorite = (id) => favorites.some(fav => fav.id === id);

  const handleFavoriteToggle = (item) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterSection}>
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </div>
      
      <div style={styles.content}>
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Поиск блюд..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, sortBy, sortOrder }));
            }}
            style={styles.sortSelect}
          >
            <option value="name-asc">По названию (А-Я)</option>
            <option value="price-asc">По цене (возрастание)</option>
            <option value="price-desc">По цене (убывание)</option>
            <option value="rating-desc">По рейтингу</option>
          </select>
        </div>

        <div style={styles.menuGrid}>
          {filteredItems.map(item => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardImage}>{item.emoji}</div>
              <button
                onClick={() => handleFavoriteToggle(item)}
                style={styles.favoriteBtn}
              >
                {isFavorite(item.id) ? <FaHeart color="#ff4444" /> : <FaRegHeart />}
              </button>
              <h3 style={styles.cardTitle}>{item.name}</h3>
              <p style={styles.cardCategory}>{item.category}</p>
              <div style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < Math.floor(item.rating) ? "#FFD700" : "#e0e0e0"} size={14} />
                ))}
                <span style={styles.ratingValue}>{item.rating}</span>
              </div>
              <p style={styles.cardPrice}>{item.price} ₽</p>
              {!item.available && <p style={styles.unavailable}>Нет в наличии</p>}
              <button
                onClick={() => addToCart(item)}
                disabled={!item.available}
                style={{
                  ...styles.orderBtn,
                  ...(!item.available && styles.disabledBtn)
                }}
              >
                {item.available ? 'В корзину' : 'Недоступно'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '2rem',
  },
  filterSection: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  content: {
    animation: 'fadeIn 0.5s ease',
  },
  searchBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  searchInput: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '1rem',
  },
  sortSelect: {
    padding: '0.75rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    padding: '1rem',
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: 'var(--shadow-hover)',
    },
  },
  cardImage: {
    fontSize: '4rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  favoriteBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  cardTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
    color: 'var(--text-primary)',
  },
  cardCategory: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginBottom: '0.5rem',
  },
  ratingValue: {
    marginLeft: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
}

export default HomePage;