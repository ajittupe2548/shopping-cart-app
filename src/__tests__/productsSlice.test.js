import { configureStore } from "@reduxjs/toolkit";
import productsReducer, { fetchProducts } from "../store/productsSlice";

// Mock fetch
global.fetch = jest.fn();

describe("productsSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productsReducer,
      },
    });
    fetch.mockClear();
  });

  const mockProducts = [
    {
      id: 1,
      title: "Test Product 1",
      price: 29.99,
      description: "Test description",
      category: "test",
      image: "test1.jpg",
      rating: { rate: 4.5, count: 120 },
    },
    {
      id: 2,
      title: "Test Product 2",
      price: 39.99,
      description: "Test description 2",
      category: "test",
      image: "test2.jpg",
      rating: { rate: 4.0, count: 80 },
    },
  ];

  test("should handle initial state", () => {
    const state = store.getState().products;
    expect(state.items).toEqual([]);
    expect(state.status).toBe("idle");
    expect(state.error).toBe(null);
  });

  test("should handle fetchProducts.pending", () => {
    store.dispatch(fetchProducts.pending());
    const state = store.getState().products;

    expect(state.status).toBe("loading");
    expect(state.error).toBe(null);
  });

  test("should handle fetchProducts.fulfilled", () => {
    store.dispatch(fetchProducts.fulfilled(mockProducts));
    const state = store.getState().products;

    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(mockProducts);
    expect(state.error).toBe(null);
  });

  test("should handle fetchProducts.rejected", () => {
    const errorMessage = "Failed to fetch products";
    store.dispatch(fetchProducts.rejected(null, "", "", errorMessage));
    const state = store.getState().products;

    expect(state.status).toBe("failed");
    expect(state.error).toBe(errorMessage);
  });

  test("should fetch products successfully", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    });

    await store.dispatch(fetchProducts());
    const state = store.getState().products;

    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(mockProducts);
    expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");
  });

  test("should handle fetch products error", async () => {
    const errorMessage = "Network Error";
    fetch.mockRejectedValue(new Error(errorMessage));

    await store.dispatch(fetchProducts());
    const state = store.getState().products;

    expect(state.status).toBe("failed");
    expect(state.error).toBe(errorMessage);
  });

  test("should handle HTTP error status", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    await store.dispatch(fetchProducts());
    const state = store.getState().products;

    expect(state.status).toBe("failed");
    expect(state.error).toBe("HTTP error! status: 404");
  });

  test("matches snapshot with initial state", () => {
    const state = store.getState().products;
    expect(state).toMatchSnapshot();
  });

  test("matches snapshot with loaded products", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    await store.dispatch(fetchProducts());
    const state = store.getState().products;
    expect(state).toMatchSnapshot();
  });
});
