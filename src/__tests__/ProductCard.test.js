import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductCard from "../components/ProductCard";
import cartReducer from "../store/cartSlice";

const mockProduct = {
  id: 1,
  title: "Test Product",
  description: "This is a test product description",
  price: 29.99,
  image: "test-image.jpg",
  category: "test category",
  rating: {
    rate: 4.5,
    count: 120,
  },
};

const renderWithRedux = (component, initialState = {}) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: initialState,
  });

  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("ProductCard", () => {
  test("renders product information correctly", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test product description")
    ).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("test category")).toBeInTheDocument();
    expect(screen.getByText("(120 reviews)")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add to Cart" })
    ).toBeInTheDocument();
  });

  test("displays product image with correct attributes", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    const image = screen.getByRole("img", { name: "Test Product" });
    expect(image).toHaveAttribute("src", "test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test Product");
  });

  test("dispatches addToCart action when button is clicked", () => {
    const { store } = renderWithRedux(<ProductCard product={mockProduct} />);

    const addToCartButton = screen.getByRole("button", { name: "Add to Cart" });
    fireEvent.click(addToCartButton);

    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0]).toEqual({
      id: 1,
      title: "Test Product",
      price: 29.99,
      image: "test-image.jpg",
      quantity: 1,
    });
  });

  test("handles product without rating", () => {
    const productWithoutRating = { ...mockProduct, rating: undefined };
    renderWithRedux(<ProductCard product={productWithoutRating} />);

    expect(screen.getByText("(0 reviews)")).toBeInTheDocument();
  });

  test("matches snapshot", () => {
    const { container } = renderWithRedux(
      <ProductCard product={mockProduct} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("matches snapshot with no rating", () => {
    const productWithoutRating = {
      ...mockProduct,
      rating: { rate: 0, count: 0 },
    };

    const { container } = renderWithRedux(
      <ProductCard product={productWithoutRating} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("handles image loading states", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    const image = screen.getByRole("img", { name: "Test Product" });
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    fireEvent.load(image);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  test("handles image error state", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    const image = screen.getByRole("img", { name: "Test Product" });
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    fireEvent.error(image);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByText("Image not available")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("renders stars correctly for different ratings", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);
    expect(screen.getByText("⭐⭐⭐⭐⭐")).toBeInTheDocument();

    const productWith3Rating = {
      ...mockProduct,
      rating: { rate: 3.0, count: 50 },
    };
    const { container: container2 } = renderWithRedux(
      <ProductCard product={productWith3Rating} />
    );
    expect(container2).toHaveTextContent("⭐⭐⭐");

    const productWithHalfRating = {
      ...mockProduct,
      rating: { rate: 2.7, count: 30 },
    };
    const { container: container3 } = renderWithRedux(
      <ProductCard product={productWithHalfRating} />
    );
    expect(container3).toHaveTextContent("⭐⭐⭐");

    const productWithZeroRating = {
      ...mockProduct,
      rating: { rate: 0, count: 5 },
    };
    renderWithRedux(<ProductCard product={productWithZeroRating} />);
    expect(screen.getByText("(5 reviews)")).toBeInTheDocument();
  });

  test("renders image with lazy loading attributes", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    const image = screen.getByRole("img", { name: "Test Product" });
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  test("applies loaded class when image loads", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    const image = screen.getByRole("img", { name: "Test Product" });
    expect(image).not.toHaveClass("loaded");

    fireEvent.load(image);
    expect(image).toHaveClass("loaded");
  });
});
