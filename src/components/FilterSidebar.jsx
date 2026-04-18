import React, { useState } from 'react';
import { categories } from  "../utils/data"

const FilterSidebar = ({ filters, setFilters }) => {
  const [localPrice, setLocalPrice] = useState(filters.maxPrice);

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalPrice(value);
    setFilters(prev => ({
      ...prev,
      maxPrice: value
    }));
  };

  const handleRatingChange = () => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === 3 ? 0 : 3
    }));
  };

  const handleAvailabilityChange = () => {
    setFilters(prev => ({
      ...prev,
      onlyAvailable: !prev.onlyAvailable
    }));
  };

  const resetFilters = () => {
    setLocalPrice(1000);
    setFilters({
      categories: [],
      maxPrice: 1000,
      minRating: 0,
      onlyAvailable: false,
      searchTerm: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>Фильтры</h3>
      
      <div style={styles.section}>
        <h4 style={styles.subtitle}>Категории</h4>
        {categories.map(cat => (
          <label key={cat} style={styles.checkbox}>
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>

      <div style={styles.section}>
        <h4 style={styles.subtitle}>Максимальная цена: {localPrice} ₽</h4>
        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={localPrice}
          onChange={handlePriceChange}
          style={styles.slider}
        />
        <div style={styles.priceRange}>
          <span>0 ₽</span>
          <span>1000 ₽</span>
        </div>
      </div>

      <div style={styles.section}>
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={filters.minRating === 3}
            onChange={handleRatingChange}
          />
          <span>⭐ Рейтинг 3+</span>
        </label>
      </div>

      <div style={styles.section}>
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={handleAvailabilityChange}
          />
          <span>✅ Только доступные</span>
        </label>
      </div>

      <button onClick={resetFilters} style={styles.resetBtn}>
        🗑️ Сбросить все фильтры
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    backgroundColor: 'var(--bg-secondary)',
    padding: '1.5rem',
    borderRadius: '12px',
    position: 'sticky',
    top: '80px',
    height: 'fit-content',
    boxShadow: 'var(--shadow)',
  },
  title: {
    marginBottom: '1rem',
    color: 'var(--text-primary)',
    fontSize: '1.3rem',
    borderBottom: '2px solid var(--accent)',
    paddingBottom: '0.5rem',
    display: 'inline-block',
  },
  subtitle: {
    marginBottom: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  section: {
    marginBottom: '1.5rem',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    ':hover': {
      color: 'var(--accent)',
    },
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
    accentColor: 'var(--accent)',
  },
  priceRange: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  resetBtn: {
    width: '100%',
    padding: '0.6rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '0.95rem',
    fontWeight: '500',
    marginTop: '0.5rem',
    ':hover': {
      backgroundColor: 'var(--accent)',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
    },
  },
};

export default FilterSidebar;