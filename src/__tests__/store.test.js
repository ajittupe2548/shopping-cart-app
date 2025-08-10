import store from "../store/index";

describe("Store Configuration", () => {
  test("store is configured with correct reducers", () => {
    const state = store.getState();

    expect(state).toHaveProperty("products");
    expect(state).toHaveProperty("cart");
  });

  test("products reducer has correct initial state", () => {
    const state = store.getState();

    expect(state.products).toEqual({
      items: [],
      status: "idle",
      error: null,
    });
  });

  test("cart reducer has correct initial state", () => {
    const state = store.getState();

    expect(state.cart).toEqual({
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
      isOpen: false,
    });
  });

  test("store can dispatch actions", () => {
    // Test that we can dispatch an action
    const action = { type: "cart/toggleCart" };
    expect(() => store.dispatch(action)).not.toThrow();
  });

  test("store subscription works", () => {
    let callCount = 0;
    const unsubscribe = store.subscribe(() => {
      callCount++;
    });

    store.dispatch({ type: "cart/toggleCart" });
    expect(callCount).toBe(1);

    unsubscribe();
  });

  test("matches snapshot", () => {
    const state = store.getState();
    expect(state).toMatchSnapshot();
  });
});
