import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductList from "../components/ProductList";
import productsReducer from "../store/productsSlice";
import cartReducer from "../store/cartSlice";

// Mock ProductCard component
jest.mock("../components/ProductCard", () => {
  return function MockProductCard({ product }) {
    return <div data-testid={`product-${product.id}`}>{product.title}</div>;
  };
});

// Mock fetch API
global.fetch = jest.fn();

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      cart: cartReducer,
    },
    preloadedState: initialState,
  });
};

const mockProducts = [
  {
    id: 1,
    title: "Test Product 1",
    price: 10.99,
    description: "Test description 1",
    category: "test",
    image: "test1.jpg",
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: "Test Product 2",
    price: 20.99,
    description: "Test description 2",
    category: "test",
    image: "test2.jpg",
    rating: { rate: 3.8, count: 50 },
  },
];

describe("ProductList Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders loading state initially", () => {
    const store = createTestStore({
      products: { items: [], status: "loading", error: null },
    });

    const { getByText } = render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(getByText("Loading products...")).toBeInTheDocument();
  });

  test("renders error state when fetch fails", () => {
    const store = createTestStore({
      products: { items: [], status: "failed", error: "Failed to fetch" },
    });

    const { getByText } = render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(getByText("Error: Failed to fetch")).toBeInTheDocument();
  });

  test("renders products when loaded successfully", () => {
    const store = createTestStore({
      products: { items: mockProducts, status: "succeeded", error: null },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(getByTestId("product-1")).toBeInTheDocument();
    expect(getByTestId("product-2")).toBeInTheDocument();
    expect(getByTestId("product-1")).toHaveTextContent("Test Product 1");
    expect(getByTestId("product-2")).toHaveTextContent("Test Product 2");
  });

  test("dispatches fetchProducts when status is idle", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const store = createTestStore({
      products: { items: [], status: "idle", error: null },
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");
    });
  });

  test("does not dispatch fetchProducts when status is not idle", () => {
    const store = createTestStore({
      products: { items: mockProducts, status: "succeeded", error: null },
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(fetch).not.toHaveBeenCalled();
  });

  test("has correct container structure", () => {
    const store = createTestStore({
      products: { items: mockProducts, status: "succeeded", error: null },
    });

    const { container } = render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Check that the component renders and has the expected structure
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild.children).toHaveLength(1); // Should have one child (the products grid)
    expect(
      container.querySelector('[data-testid="product-1"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="product-2"]')
    ).toBeInTheDocument();
  });

  test("matches snapshot with products", () => {
    const store = createTestStore({
      products: { items: mockProducts, status: "succeeded", error: null },
    });

    const { container } = render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test("matches snapshot in loading state", () => {
    const store = createTestStore({
      products: { items: [], status: "loading", error: null },
    });

    const { container } = render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test("matches snapshot in error state", () => {
    const store = createTestStore({
      products: { items: [], status: "failed", error: "Network error" },
    });

    const { container } = render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
