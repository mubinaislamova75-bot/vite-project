import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';

const Header = ({ cartItemsCount, favoritesCount }) => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Главная', icon: null },
    { path: '/favorites', label: 'Избранное', icon: <FaHeart />, count: favoritesCount },
    { path: '/cart', label: 'Корзина', icon: <FaShoppingCart />, count: cartItemsCount },
    { path: '/profile', label: 'Профиль', icon: <FaUser /> },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🍽️</span>
          <span style={styles.logoText}>Доставка Еды</span>
        </Link>

        <button style={styles.menuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <nav style={{ ...styles.nav, ...(isMenuOpen ? styles.navOpen : {}) }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.icon && <span style={styles.navIcon}>{link.icon}</span>}
              <span>{link.label}</span>
              {link.count > 0 && <span style={styles.badge}>{link.count}</span>}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Выйти
            </button>
          ) : (
            <Link to="/login" style={styles.loginBtn} onClick={() => setIsMenuOpen(false)}>
              Войти
            </Link>
          )}
          
          <button onClick={toggleTheme} style={styles.themeBtn}>
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: 'var(--bg-primary)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'var(--accent)',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  logoText: {
    background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  navOpen: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'var(--bg-primary)',
    padding: '1rem',
    borderBottom: '1px solid var(--border-color)',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'var(--text-primary)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s',
    position: 'relative',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.75rem',
    minWidth: '18px',
    textAlign: 'center',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  loginBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--accent)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s',
  },
  themeBtn: {
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-primary)',
  },
  menuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-primary)',
  },
};

// Адаптивность
if (window.innerWidth <= 768) {
  styles.menuButton.display = 'block';
  styles.nav.display = 'none';
}

export default Header;