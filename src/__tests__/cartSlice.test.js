import { configureStore } from "@reduxjs/toolkit";
import cartReducer, {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  toggleCart,
} from "../store/cartSlice";

describe("cartSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
  });

  const mockProduct = {
    id: 1,
    title: "Test Product",
    price: 29.99,
    image: "test-image.jpg",
  };

  test("should handle initial state", () => {
    const state = store.getState().cart;
    expect(state.items).toEqual([]);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalAmount).toBe(0);
    expect(state.isOpen).toBe(false);
  });

  test("should handle addToCart", () => {
    store.dispatch(addToCart(mockProduct));
    const state = store.getState().cart;

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({
      ...mockProduct,
      quantity: 1,
    });
    expect(state.totalQuantity).toBe(1);
    expect(state.totalAmount).toBe(29.99);
  });

  test("should increase quantity when adding existing product", () => {
    store.dispatch(addToCart(mockProduct));
    store.dispatch(addToCart(mockProduct));
    const state = store.getState().cart;

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
    expect(state.totalQuantity).toBe(2);
    expect(state.totalAmount).toBe(59.98);
  });

  test("should handle removeFromCart", () => {
    store.dispatch(addToCart(mockProduct));
    store.dispatch(removeFromCart(1));
    const state = store.getState().cart;

    expect(state.items).toHaveLength(0);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalAmount).toBe(0);
  });

  test("should handle increaseQuantity", () => {
    store.dispatch(addToCart(mockProduct));
    store.dispatch(increaseQuantity(1));
    const state = store.getState().cart;

    expect(state.items[0].quantity).toBe(2);
    expect(state.totalQuantity).toBe(2);
    expect(state.totalAmount).toBe(59.98);
  });

  test("should handle decreaseQuantity", () => {
    store.dispatch(addToCart(mockProduct));
    store.dispatch(addToCart(mockProduct)); // quantity = 2
    store.dispatch(decreaseQuantity(1));
    const state = store.getState().cart;

    expect(state.items[0].quantity).toBe(1);
    expect(state.totalQuantity).toBe(1);
    expect(state.totalAmount).toBe(29.99);
  });

  test("should not decrease quantity below 1", () => {
    store.dispatch(addToCart(mockProduct));
    store.dispatch(decreaseQuantity(1));
    const state = store.getState().cart;

    expect(state.items[0].quantity).toBe(1);
    expect(state.totalQuantity).toBe(1);
  });

  test("should handle clearCart", () => {
    store.dispatch(addToCart(mockProduct));
    store.dispatch(clearCart());
    const state = store.getState().cart;

    expect(state.items).toHaveLength(0);
    expect(state.totalQuantity).toBe(0);
    expect(state.totalAmount).toBe(0);
  });

  test("should handle toggleCart", () => {
    store.dispatch(toggleCart());
    let state = store.getState().cart;
    expect(state.isOpen).toBe(true);

    store.dispatch(toggleCart());
    state = store.getState().cart;
    expect(state.isOpen).toBe(false);
  });

  test("should handle removeFromCart for non-existing item", () => {
    const initialState = store.getState().cart;
    store.dispatch(removeFromCart(999)); // Non-existing item
    const state = store.getState().cart;

    expect(state).toEqual(initialState);
  });

  test("should handle increaseQuantity for non-existing item", () => {
    const initialState = store.getState().cart;
    store.dispatch(increaseQuantity(999)); // Non-existing item
    const state = store.getState().cart;

    expect(state).toEqual(initialState);
  });

  test("should handle decreaseQuantity for non-existing item", () => {
    const initialState = store.getState().cart;
    store.dispatch(decreaseQuantity(999)); // Non-existing item
    const state = store.getState().cart;

    expect(state).toEqual(initialState);
  });

  test("matches snapshot with empty cart", () => {
    const state = store.getState().cart;
    expect(state).toMatchSnapshot();
  });

  test("matches snapshot with items in cart", () => {
    store.dispatch(addToCart(mockProduct));
    store.dispatch(addToCart({ ...mockProduct, id: 2, title: "Product 2" }));
    const state = store.getState().cart;
    expect(state).toMatchSnapshot();
  });
});
