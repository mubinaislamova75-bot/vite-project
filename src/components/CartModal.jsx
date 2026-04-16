import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CartModal = ({ cart, updateQuantity, removeFromCart, totalPrice, onClose, onOrder }) => {
  const { user } = useAuth();
  const [address, setAddress] = useState(user?.address || '');
  const [showAddressInput, setShowAddressInput] = useState(false);

  const handleOrder = () => {
    if (!address) {
      setShowAddressInput(true);
      return;
    }
    onOrder(address);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Оформление заказа</h2>
        
        {cart.length === 0 ? (
          <p style={styles.empty}>Корзина пуста</p>
        ) : (
          <>
            <div style={styles.items}>
              {cart.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <span style={styles.itemName}>{item.name}</span>
                  <div style={styles.itemControls}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>🗑️</button>
                  </div>
                  <span style={styles.itemPrice}>{item.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>
            
            <div style={styles.total}>
              <strong>Итого:</strong> {totalPrice} ₽
            </div>

            {(showAddressInput || !user?.address) && (
              <div style={styles.addressSection}>
                <label style={styles.label}>Адрес доставки:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Введите адрес доставки"
                  style={styles.addressInput}
                />
              </div>
            )}

            <div style={styles.buttons}>
              <button onClick={onClose} style={styles.cancelBtn}>Отмена</button>
              <button onClick={handleOrder} style={styles.orderBtn}>Подтвердить заказ</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
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
    animation: 'fadeIn 0.3s ease',
  },
  modal: {
    backgroundColor: 'var(--bg-primary)',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  title: {
    marginBottom: '1rem',
    color: 'var(--text-primary)',
  },
  items: {
    marginBottom: '1rem',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--border-color)',
  },
  itemName: {
    flex: 1,
  },
  itemControls: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  qtyBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  itemPrice: {
    minWidth: '80px',
    textAlign: 'right',
  },
  total: {
    fontSize: '1.2rem',
    textAlign: 'right',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '2px solid var(--border-color)',
  },
  addressSection: {
    marginTop: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
  },
  addressInput: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  orderBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: 'var(--text-secondary)',
  },
};

export default CartModal;