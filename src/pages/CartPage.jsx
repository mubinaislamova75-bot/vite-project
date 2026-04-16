import React, { useState } from 'react';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaCreditCard, FaMotorcycle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const CartPage = ({ cart, updateQuantity, removeFromCart, placeOrder }) => {
  const { user } = useAuth();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice = deliveryMethod === 'delivery' ? (totalPrice > 500 ? 0 : 99) : 0;
  const finalPrice = totalPrice + deliveryPrice;

  const handleOrder = () => {
    if (!address && deliveryMethod === 'delivery') {
      alert('Пожалуйста, укажите адрес доставки');
      return;
    }
    placeOrder(address || 'Самовывоз');
    setShowOrderModal(false);
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Корзина пуста</h2>
        <p style={styles.emptyText}>Добавьте блюда в корзину, чтобы оформить заказ</p>
        <button 
          onClick={() => window.location.href = '/'} 
          style={styles.emptyButton}
        >
          Выбрать блюда
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FaShoppingCart style={styles.titleIcon} /> Корзина
        </h1>
        <p style={styles.subtitle}>{cart.length} {cart.length === 1 ? 'блюдо' : 'блюд'} в корзине</p>
      </div>

      <div style={styles.content}>
        <div style={styles.cartItems}>
          {cart.map(item => (
            <div key={item.id} style={styles.cartItem}>
              <div style={styles.itemImage}>{item.emoji}</div>
              
              <div style={styles.itemDetails}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemCategory}>{item.category}</p>
                <p style={styles.itemPrice}>{item.price} ₽</p>
              </div>

              <div style={styles.itemControls}>
                <button 
                  onClick={() => updateQuantity(item.id, -1)} 
                  style={styles.qtyBtn}
                >
                  <FaMinus />
                </button>
                <span style={styles.itemQuantity}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)} 
                  style={styles.qtyBtn}
                >
                  <FaPlus />
                </button>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  style={styles.removeBtn}
                >
                  <FaTrash />
                </button>
              </div>

              <div style={styles.itemTotal}>
                {item.price * item.quantity} ₽
              </div>
            </div>
          ))}

          <div style={styles.promoSection}>
            <input 
              type="text" 
              placeholder="Промокод" 
              style={styles.promoInput}
            />
            <button style={styles.promoBtn}>Применить</button>
          </div>
        </div>

        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Детали заказа</h3>
          
          <div style={styles.summaryRow}>
            <span>Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
            <span>{totalPrice} ₽</span>
          </div>
          
          <div style={styles.summaryRow}>
            <span>Доставка</span>
            <span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice} ₽`}</span>
          </div>
          
          <div style={styles.summaryTotal}>
            <span>Итого</span>
            <span style={styles.totalPrice}>{finalPrice} ₽</span>
          </div>

          <div style={styles.deliveryMethods}>
            <button
              onClick={() => setDeliveryMethod('delivery')}
              style={{
                ...styles.methodBtn,
                ...(deliveryMethod === 'delivery' && styles.activeMethod)
              }}
            >
              <FaMotorcycle /> Доставка
            </button>
            <button
              onClick={() => setDeliveryMethod('pickup')}
              style={{
                ...styles.methodBtn,
                ...(deliveryMethod === 'pickup' && styles.activeMethod)
              }}
            >
              <FaCreditCard /> Самовывоз
            </button>
          </div>

          {deliveryMethod === 'delivery' && (
            <div style={styles.addressSection}>
              <label style={styles.addressLabel}>Адрес доставки:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Улица, дом, квартира"
                style={styles.addressInput}
              />
            </div>
          )}

          <button 
            onClick={() => setShowOrderModal(true)} 
            style={styles.orderBtn}
          >
            Оформить заказ
          </button>
        </div>
      </div>

      {showOrderModal && (
        <div style={styles.modalOverlay} onClick={() => setShowOrderModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Подтверждение заказа</h2>
            
            <div style={styles.modalContent}>
              <p><strong>Сумма заказа:</strong> {finalPrice} ₽</p>
              <p><strong>Способ получения:</strong> {deliveryMethod === 'delivery' ? 'Доставка' : 'Самовывоз'}</p>
              {deliveryMethod === 'delivery' && <p><strong>Адрес:</strong> {address}</p>}
              
              <div style={styles.orderItems}>
                <h4>Состав заказа:</h4>
                {cart.map(item => (
                  <div key={item.id} style={styles.orderItem}>
                    <span>{item.name} x{item.quantity}</span>
                    <span>{item.price * item.quantity} ₽</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.modalButtons}>
              <button 
                onClick={() => setShowOrderModal(false)} 
                style={styles.cancelModalBtn}
              >
                Отмена
              </button>
              <button 
                onClick={handleOrder} 
                style={styles.confirmModalBtn}
              >
                Подтвердить заказ
              </button>
            </div>
          </div>
        </div>
      )}
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
    color: 'var(--accent)',
    WebkitTextFillColor: 'var(--accent)',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
    marginTop: '0.5rem',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '2rem',
  },
  cartItems: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid var(--border-color)',
  },
  itemImage: {
    fontSize: '3rem',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '1.1rem',
    marginBottom: '0.25rem',
    color: 'var(--text-primary)',
  },
  itemCategory: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  itemPrice: {
    fontSize: '0.9rem',
    color: 'var(--accent)',
    marginTop: '0.25rem',
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  qtyBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'var(--accent)',
      color: 'white',
      borderColor: 'var(--accent)',
    },
  },
  itemQuantity: {
    minWidth: '30px',
    textAlign: 'center',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ff4444',
    fontSize: '1.1rem',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  itemTotal: {
    fontWeight: 'bold',
    color: 'var(--accent)',
    minWidth: '80px',
    textAlign: 'right',
  },
  promoSection: {
    marginTop: '1.5rem',
    display: 'flex',
    gap: '1rem',
  },
  promoInput: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
  },
  promoBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'var(--accent)',
      color: 'white',
    },
  },
  summary: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    padding: '1.5rem',
    position: 'sticky',
    top: '80px',
    height: 'fit-content',
  },
  summaryTitle: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: 'var(--text-primary)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    color: 'var(--text-secondary)',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '2px solid var(--border-color)',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  totalPrice: {
    color: 'var(--accent)',
    fontSize: '1.3rem',
  },
  deliveryMethods: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    marginBottom: '1rem',
  },
  methodBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s',
  },
  activeMethod: {
    backgroundColor: 'var(--accent)',
    color: 'white',
    borderColor: 'var(--accent)',
  },
  addressSection: {
    marginBottom: '1rem',
  },
  addressLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  addressInput: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
  },
  orderBtn: {
    width: '100%',
    padding: '0.75rem',
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
      transform: 'scale(1.02)',
    },
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalTitle: {
    marginBottom: '1rem',
    color: 'var(--text-primary)',
  },
  modalContent: {
    marginBottom: '1.5rem',
  },
  orderItems: {
    marginTop: '1rem',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--border-color)',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
  },
  cancelModalBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  confirmModalBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default CartPage;