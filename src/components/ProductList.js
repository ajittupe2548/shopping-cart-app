import React, { useEffect, memo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  setCurrentPage,
  setItemsPerPage,
  setSelectedCategory,
  setSelectedMinPrice,
  setSelectedMaxPrice,
  setSelectedMinRating,
  setSelectedMaxRating,
} from "../store/productsSlice";
import ProductCard from "./ProductCard";
import styles from "./ProductList.module.scss";
import { useSearchParams, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const ProductList = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    items: products,
    status,
    error,
    currentPage,
    itemsPerPage,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    selectedMinPrice,
    selectedMaxPrice,
    selectedMinRating,
    selectedMaxRating,
  } = useSelector(state => state.products);

  // Sync Redux state with URL params on mount and param change
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("perPage")) || 4;
    const category = searchParams.get("category") || "all";
    const minPrice = Number(searchParams.get("minPrice"));
    const maxPrice = Number(searchParams.get("maxPrice"));
    const minRating = Number(searchParams.get("minRating"));
    const maxRating = Number(searchParams.get("maxRating"));
    const search = searchParams.get("search") || "";
    dispatch(setCurrentPage(page));
    dispatch(setItemsPerPage(perPage));
    dispatch(setSelectedCategory(category));
    if (!isNaN(minPrice)) dispatch(setSelectedMinPrice(minPrice));
    if (!isNaN(maxPrice)) dispatch(setSelectedMaxPrice(maxPrice));
    if (!isNaN(minRating)) dispatch(setSelectedMinRating(minRating));
    if (!isNaN(maxRating)) dispatch(setSelectedMaxRating(maxRating));
    setSearchTerm(search);
    // eslint-disable-next-line
  }, []);

  // Update URL when filters change
  useEffect(() => {
    setSearchParams({
      page: currentPage,
      perPage: itemsPerPage,
      category: selectedCategory,
      minPrice: selectedMinPrice,
      maxPrice: selectedMaxPrice,
      minRating: selectedMinRating,
      maxRating: selectedMaxRating,
      search: searchTerm,
    });
    // eslint-disable-next-line
  }, [
    currentPage,
    itemsPerPage,
    selectedCategory,
    selectedMinPrice,
    selectedMaxPrice,
    selectedMinRating,
    selectedMaxRating,
    searchTerm,
  ]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Get unique categories from products
  const categories = [
    "all",
    ...Array.from(new Set(products.map(product => product.category))),
  ];

  // Filter products by all filters
  const filteredProducts = products.filter(
    product =>
      (selectedCategory === "all" || product.category === selectedCategory) &&
      product.price >= selectedMinPrice &&
      product.price <= selectedMaxPrice &&
      (product.rating?.rate || 0) >= selectedMinRating &&
      (product.rating?.rate || 0) <= selectedMaxRating &&
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleItemsPerPageChange = e => {
    dispatch(setItemsPerPage(Number(e.target.value)));
  };

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleCategoryChange = e => {
    dispatch(setSelectedCategory(e.target.value));
  };

  const handleMinPriceChange = e => {
    dispatch(setSelectedMinPrice(Number(e.target.value)));
  };
  const handleMaxPriceChange = e => {
    dispatch(setSelectedMaxPrice(Number(e.target.value)));
  };
  const handleMinRatingChange = e => {
    dispatch(setSelectedMinRating(Number(e.target.value)));
  };
  const handleMaxRatingChange = e => {
    dispatch(setSelectedMaxRating(Number(e.target.value)));
  };

  if (status === "loading") {
    return <div className={styles.loading}>Loading products...</div>;
  }

  if (status === "failed") {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <label htmlFor="itemsPerPage">Items per page: </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          {[4, 8, 12, 16, 20].map(count => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
        <label htmlFor="categoryFilter" style={{ marginLeft: "1.5rem" }}>
          Category:{" "}
        </label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <label htmlFor="priceRange" style={{ marginLeft: "1.5rem" }}>
          Price:
        </label>
        <div style={{ width: 220, display: "inline-block", margin: "0 8px" }}>
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            value={[selectedMinPrice, selectedMaxPrice]}
            allowCross={false}
            onChange={([min, max]) => {
              dispatch(setSelectedMinPrice(min));
              dispatch(setSelectedMaxPrice(max));
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
            }}
          >
            <span>{selectedMinPrice}</span>
            <span>{selectedMaxPrice}</span>
          </div>
        </div>
        <label htmlFor="ratingRange" style={{ marginLeft: "1.5rem" }}>
          Rating:
        </label>
        <div style={{ width: 160, display: "inline-block", margin: "0 8px" }}>
          <Slider
            range
            min={minRating}
            max={maxRating}
            step={0.1}
            value={[selectedMinRating, selectedMaxRating]}
            allowCross={false}
            onChange={([min, max]) => {
              dispatch(setSelectedMinRating(min));
              dispatch(setSelectedMaxRating(max));
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
            }}
          >
            <span>{selectedMinRating}</span>
            <span>{selectedMaxRating}</span>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchBox}
          style={{ marginLeft: "1.5rem", minWidth: 180 }}
        />
      </div>
      <div className={styles.productsGrid}>
        {paginatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? styles.activePage : ""}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
});

ProductList.displayName = "ProductList";

export default ProductList;
