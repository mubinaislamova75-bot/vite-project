import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHistory,
  FaEdit,
  FaSave,
  FaTimes,
  FaShoppingBag,
} from "react-icons/fa";

const ProfilePage = ({ orders }) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
  });

  const handleSave = () => {
    updateProfile(editedUser);
    setIsEditing(false);
    alert("Профиль успешно обновлен!");
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Доставляется":
        return "#FF6B35";
      case "Доставлен":
        return "#28a745";
      case "Отменен":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FaUser style={styles.titleIcon} /> Мой профиль
        </h1>
      </div>

      <div style={styles.content}>
        <div style={styles.profileSection}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>{user?.name?.charAt(0) || "U"}</div>
            <h2 style={styles.userName}>{user?.name || "Пользователь"}</h2>
            <p style={styles.userEmail}>{user?.email}</p>
          </div>

          <div style={styles.infoSection}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Личная информация</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={styles.editBtn}
                >
                  <FaEdit /> Редактировать
                </button>
              ) : (
                <div style={styles.editActions}>
                  <button onClick={handleSave} style={styles.saveBtn}>
                    <FaSave /> Сохранить
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={styles.cancelEditBtn}
                  >
                    <FaTimes /> Отмена
                  </button>
                </div>
              )}
            </div>

            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <FaUser style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <label>Имя</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, name: e.target.value })
                      }
                      style={styles.editInput}
                    />
                  ) : (
                    <p>{user?.name || "Не указано"}</p>
                  )}
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaEnvelope style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                      style={styles.editInput}
                    />
                  ) : (
                    <p>{user?.email}</p>
                  )}
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaMapMarkerAlt style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <label>Адрес доставки</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.address}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          address: e.target.value,
                        })
                      }
                      placeholder="Улица, дом, квартира"
                      style={styles.editInput}
                    />
                  ) : (
                    <p>{user?.address || "Не указан"}</p>
                  )}
                </div>
              </div>

              <div style={styles.infoItem}>
                <FaHistory style={styles.infoIcon} />
                <div style={styles.infoContent}>
                  <label>Телефон</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, phone: e.target.value })
                      }
                      placeholder="+7 (XXX) XXX-XX-XX"
                      style={styles.editInput}
                    />
                  ) : (
                    <p>{user?.phone || "Не указан"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.ordersSection}>
          <h3 style={styles.sectionTitle}>
            <FaShoppingBag /> История заказов
          </h3>

          {orders.length === 0 ? (
            <div style={styles.noOrders}>
              <p>У вас пока нет заказов</p>
              <button
                onClick={() => (window.location.href = "/")}
                style={styles.orderBtn}
              >
                Сделать первый заказ
              </button>
            </div>
          ) : (
            <div style={styles.ordersList}>
              {orders.map((order) => (
                <div key={order.id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div>
                      <span style={styles.orderId}>Заказ #{order.id}</span>
                      <span style={styles.orderDate}>
                        {new Date(order.date).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                    <span
                      style={{
                        ...styles.orderStatus,
                        backgroundColor: getOrderStatusColor(order.status),
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div style={styles.orderItems}>
                    {order.items.map((item) => (
                      <div key={item.id} style={styles.orderItem}>
                        <span>
                          {item.emoji} {item.name}
                        </span>
                        <span>x{item.quantity}</span>
                        <span>{item.price * item.quantity} ₽</span>
                      </div>
                    ))}
                  </div>

                  <div style={styles.orderFooter}>
                    <div style={styles.orderAddress}>
                      <FaMapMarkerAlt /> {order.address}
                    </div>
                    <div style={styles.orderTotal}>
                      Итого: <strong>{order.total} ₽</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    animation: "fadeIn 0.5s ease",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  title: {
    fontSize: "2.5rem",
    background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  titleIcon: {
    color: "var(--accent)",
    WebkitTextFillColor: "var(--accent)",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  profileSection: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "2rem",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "12px",
    overflow: "hidden",
  },
  avatarSection: {
    backgroundColor: "var(--accent)",
    padding: "2rem",
    textAlign: "center",
    color: "white",
  },
  avatar: {
    width: "100px",
    height: "100px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    margin: "0 auto 1rem",
    fontWeight: "bold",
  },
  userName: {
    fontSize: "1.3rem",
    marginBottom: "0.5rem",
  },
  userEmail: {
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  infoSection: {
    padding: "2rem",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: "var(--text-primary)",
  },
};
export default ProfilePage;
