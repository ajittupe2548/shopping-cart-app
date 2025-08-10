import React, { useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../store/productsSlice";
import ProductCard from "./ProductCard";
import styles from "./ProductList.module.scss";

const ProductList = memo(() => {
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
  } = useSelector(state => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading products...</div>;
  }

  if (status === "failed") {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.productsGrid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
});

ProductList.displayName = "ProductList";

export default ProductList;
