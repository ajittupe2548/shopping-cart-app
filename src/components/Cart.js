import React, { memo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  closeCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../store/cartSlice";
import styles from "./Cart.module.scss";

const Cart = memo(() => {
  const dispatch = useDispatch();
  const { items, totalAmount, isOpen } = useSelector(state => state.cart);

  const handleCloseCart = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  const handleRemoveItem = useCallback(
    id => {
      dispatch(removeFromCart(id));
    },
    [dispatch]
  );

  const handleIncreaseQuantity = useCallback(
    id => {
      dispatch(increaseQuantity(id));
    },
    [dispatch]
  );

  const handleDecreaseQuantity = useCallback(
    id => {
      dispatch(decreaseQuantity(id));
    },
    [dispatch]
  );

  const handleCheckout = useCallback(() => {
    alert(`Thank you for your purchase! Total: $${totalAmount.toFixed(2)}`);
    dispatch(clearCart());
    dispatch(closeCart());
  }, [dispatch, totalAmount]);

  return (
    <>
      <div
        className={`${styles.cartOverlay} ${isOpen ? styles.open : ""}`}
        onClick={handleCloseCart}
      ></div>

      <div className={`${styles.cartSidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Shopping Cart</h2>
          <button className={styles.closeCart} onClick={handleCloseCart}>
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {items.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.cartItemImage}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={styles.cartItemDetails}>
                    <h4 className={styles.cartItemTitle}>{item.title}</h4>
                    <div className={styles.cartItemPrice}>${item.price}</div>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => handleDecreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => handleIncreaseQuantity(item.id)}
                      >
                        +
                      </button>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          marginLeft: "10px",
                          background: "#dc3545",
                          color: "white",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartTotal}>
              <div className={styles.totalText}>
                Total: ${totalAmount.toFixed(2)}
              </div>
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
});

Cart.displayName = "Cart";

export default Cart;
