import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isLogin) {
      // Логин
      const success = login(formData.email, formData.password);
      if (success) {
        navigate('/');
      } else {
        setErrors({ ...errors, login: 'Неверный email или пароль' });
      }
    } else {
      // Регистрация
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: '',
        phone: ''
      };
      register(userData);
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Очищаем ошибку при вводе
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.leftSection}>
          <div style={styles.brand}>
            <span style={styles.brandIcon}>🍽️</span>
            <h1 style={styles.brandName}>Доставка Еды</h1>
          </div>
          <p style={styles.brandDesc}>
            Лучшие блюда из лучших ресторанов<br />
            Быстрая доставка и отличный сервис
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🚚</span>
              <span>Бесплатная доставка от 500₽</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>⭐</span>
              <span>Более 1000 отзывов</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🎁</span>
              <span>Программа лояльности</span>
            </div>
          </div>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>
              {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
            </h2>
            <p style={styles.formSubtitle}>
              {isLogin ? 'Добро пожаловать обратно!' : 'Присоединяйтесь к нам сегодня'}
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
              {!isLogin && (
                <div style={styles.inputGroup}>
                  <div style={styles.inputIcon}>
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                </div>
              )}

              <div style={styles.inputGroup}>
                <div style={styles.inputIcon}>
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                />
                {errors.email && <span style={styles.errorText}>{errors.email}</span>}
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.inputIcon}>
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && <span style={styles.errorText}>{errors.password}</span>}
              </div>

              {!isLogin && (
                <div style={styles.inputGroup}>
                  <div style={styles.inputIcon}>
                    <FaLock />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Подтвердите пароль"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.passwordToggle}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
                </div>
              )}

              {errors.login && <div style={styles.errorMessage}>{errors.login}</div>}

              <button type="submit" style={styles.submitBtn}>
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            <div style={styles.switchForm}>
              <p>
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                <button onClick={toggleForm} style={styles.switchBtn}>
                  {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div style={styles.demoInfo}>
                <p style={styles.demoTitle}>Демо-данные для входа:</p>
                <p style={styles.demoText}>Email: demo@example.com</p>
                <p style={styles.demoText}>Пароль: 123456</p>
                <p style={styles.demoNote}>
                  *Если вы не зарегистрированы, создайте новый аккаунт через "Зарегистрироваться"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-primary)',
    padding: '2rem',
  },
  wrapper: {
    maxWidth: '1000px',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-hover)',
  },
  leftSection: {
    backgroundColor: 'var(--accent)',
    padding: '3rem 2rem',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  brandIcon: {
    fontSize: '2.5rem',
  },
  brandName: {
    fontSize: '1.8rem',
    margin: 0,
  },
  brandDesc: {
    fontSize: '1rem',
    lineHeight: '1.5',
    marginBottom: '2rem',
    opacity: 0.95,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
  featureIcon: {
    fontSize: '1.2rem',
  },
  rightSection: {
    padding: '3rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: '350px',
  },
  formTitle: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
    color: 'var(--text-primary)',
    textAlign: 'center',
  },
  formSubtitle: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '0.5rem',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none',
    ':focus': {
      borderColor: 'var(--accent)',
      boxShadow: '0 0 0 2px rgba(255,107,53,0.1)',
    },
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  errorText: {
    fontSize: '0.8rem',
    color: '#ff4444',
    marginTop: '0.25rem',
    display: 'block',
  },
  errorMessage: {
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '0.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  submitBtn: {
    marginTop: '1rem',
    padding: '12px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#e55a2b',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
    },
  },
  switchForm: {
    marginTop: '1.5rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  demoInfo: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: 'rgba(255,107,53,0.1)',
    borderRadius: '8px',
    textAlign: 'center',
  },
  demoTitle: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: 'var(--accent)',
    marginBottom: '0.25rem',
  },
  demoText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    margin: '0.25rem 0',
  },
  demoNote: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    marginTop: '0.5rem',
    opacity: 0.8,
  },
};

// Адаптивность для мобильных устройств
const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
  styles.wrapper.gridTemplateColumns = '1fr';
  styles.leftSection.display = 'none';
}

export default LoginPage;