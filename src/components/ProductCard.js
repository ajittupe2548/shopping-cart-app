import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import styles from "./ProductCard.module.scss";

const ProductCard = memo(({ product }) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = useCallback(() => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      })
    );
  }, [dispatch, product.id, product.title, product.price, product.image]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    if (hasHalfStar) {
      stars.push("⭐");
    }
    return stars.join("");
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        {!imageLoaded && !imageError && (
          <div className={styles.imagePlaceholder}>Loading...</div>
        )}
        {imageError ? (
          <div className={styles.imageError}>Image not available</div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            className={`${styles.productImage} ${imageLoaded ? styles.loaded : ""}`}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productCategory}>{product.category}</div>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.productDescription}>{product.description}</p>
        <div className={styles.productRating}>
          <span className={styles.stars}>
            {renderStars(product.rating?.rate || 0)}
          </span>
          <span className={styles.ratingText}>
            ({product.rating?.count || 0} reviews)
          </span>
        </div>
        <div className={styles.productPrice}>${product.price}</div>
        <button className={styles.addToCartBtn} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
