import React, { memo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCart } from "../store/cartSlice";
import styles from "./Header.module.scss";

const Header = memo(() => {
  const dispatch = useDispatch();
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  const handleCartClick = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>Shopping Cart</h1>
        <button className={styles.cartIcon} onClick={handleCartClick}>
          🛒 Cart
          {totalQuantity > 0 && (
            <span className={styles.cartCount}>{totalQuantity}</span>
          )}
        </button>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
