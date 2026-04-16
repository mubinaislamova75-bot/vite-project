import React from 'react';
import { categories } from '../utils/data';

const FilterSidebar = ({ filters, setFilters }) => {
  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handlePriceChange = (e) => {
    setFilters(prev => ({
      ...prev,
      maxPrice: parseInt(e.target.value)
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
        <h4 style={styles.subtitle}>Максимальная цена: {filters.maxPrice} ₽</h4>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          style={styles.slider}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={filters.minRating === 3}
            onChange={handleRatingChange}
          />
          <span>Рейтинг 3+</span>
        </label>
      </div>

      <div style={styles.section}>
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={handleAvailabilityChange}
          />
          <span>Только доступные</span>
        </label>
      </div>

      <button onClick={resetFilters} style={styles.resetBtn}>
        Сбросить все фильтры
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
  },
  title: {
    marginBottom: '1rem',
    color: 'var(--text-primary)',
  },
  subtitle: {
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
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
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
  },
  resetBtn: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default FilterSidebar;