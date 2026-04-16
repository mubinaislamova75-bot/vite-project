import React, { useState } from 'react';
import { FaHeart, FaStar, FaShoppingCart, FaTrash } from 'react-icons/fa';

const FavoritesPage = ({ favorites, removeFromFavorites, addToCart }) => {
  const [addedToCart, setAddedToCart] = useState({});

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedToCart({ ...addedToCart, [item.id]: true });
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  if (favorites.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>❤️</div>
        <h2 style={styles.emptyTitle}>Избранное пусто</h2>
        <p style={styles.emptyText}>Добавляйте понравившиеся блюда в избранное, чтобы не потерять их</p>
        <button 
          onClick={() => window.location.href = '/'} 
          style={styles.emptyButton}
        >
          Перейти в меню
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FaHeart style={styles.titleIcon} /> Моё избранное
        </h1>
        <p style={styles.subtitle}>У вас {favorites.length} {favorites.length === 1 ? 'блюдо' : 'блюд'} в избранном</p>
      </div>

      <div style={styles.grid}>
        {favorites.map(item => (
          <div key={item.id} style={styles.card}>
            <div style={styles.cardImage}>{item.emoji}</div>
            
            <button
              onClick={() => removeFromFavorites(item.id)}
              style={styles.removeBtn}
              title="Удалить из избранного"
            >
              <FaTrash />
            </button>

            <h3 style={styles.cardTitle}>{item.name}</h3>
            <p style={styles.cardCategory}>{item.category}</p>
            
            <div style={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  color={i < Math.floor(item.rating) ? "#FFD700" : "#e0e0e0"} 
                  size={14} 
                />
              ))}
              <span style={styles.ratingValue}>{item.rating}</span>
            </div>

            <div style={styles.priceSection}>
              <span style={styles.cardPrice}>{item.price} ₽</span>
              {!item.available && <span style={styles.unavailable}>Нет в наличии</span>}
            </div>

            <button
              onClick={() => handleAddToCart(item)}
              disabled={!item.available}
              style={{
                ...styles.cartBtn,
                ...(!item.available && styles.disabledBtn),
                ...(addedToCart[item.id] && styles.addedBtn)
              }}
            >
              <FaShoppingCart style={styles.cartIcon} />
              {addedToCart[item.id] ? 'Добавлено!' : 'В корзину'}
            </button>
          </div>
        ))}
      </div>

      <div style={styles.recommendSection}>
        <h3 style={styles.recommendTitle}>Советуем попробовать</h3>
        <p style={styles.recommendText}>Посмотрите другие популярные блюда в нашем меню</p>
        <button 
          onClick={() => window.location.href = '/'} 
          style={styles.recommendBtn}
        >
          Перейти в меню
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    animation: 'fadeIn 0.5s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  titleIcon: {
    color: '#ff4444',
    WebkitTextFillColor: '#ff4444',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
    marginTop: '0.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    padding: '1.5rem',
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
  removeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(0,0,0,0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#ff4444',
    transition: 'all 0.3s',
    ':hover': {
      background: '#ff4444',
      color: 'white',
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
    marginBottom: '1rem',
  },
  ratingValue: {
    marginLeft: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  priceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardPrice: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: 'var(--accent)',
  },
  unavailable: {
    fontSize: '0.8rem',
    color: '#ff4444',
    backgroundColor: 'rgba(255,68,68,0.1)',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
  },
  cartBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#e55a2b',
      transform: 'scale(1.02)',
    },
  },
  disabledBtn: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#ccc',
      transform: 'none',
    },
  },
  addedBtn: {
    backgroundColor: '#28a745',
  },
  cartIcon: {
    fontSize: '1rem',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: '2rem',
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '2rem',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
  },
  emptyButton: {
    padding: '0.75rem 2rem',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#e55a2b',
      transform: 'scale(1.05)',
    },
  },
  recommendSection: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    marginTop: '2rem',
  },
  recommendTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: 'var(--text-primary)',
  },
  recommendText: {
    color: 'var(--text-secondary)',
    marginBottom: '1rem',
  },
  recommendBtn: {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'transparent',
    border: '2px solid var(--accent)',
    color: 'var(--accent)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'var(--accent)',
      color: 'white',
    },
  },
};

export default FavoritesPage;