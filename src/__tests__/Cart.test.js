import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Cart from "../components/Cart";
import cartReducer from "../store/cartSlice";

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

// Mock window.alert
global.alert = jest.fn();

describe("Cart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows empty cart message when cart is empty", () => {
    const initialState = {
      cart: {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        isOpen: true,
      },
    };

    renderWithRedux(<Cart />, initialState);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  test("displays cart items correctly", () => {
    const initialState = {
      cart: {
        items: [
          {
            id: 1,
            title: "Test Product 1",
            price: 29.99,
            image: "test1.jpg",
            quantity: 2,
          },
          {
            id: 2,
            title: "Test Product 2",
            price: 39.99,
            image: "test2.jpg",
            quantity: 1,
          },
        ],
        totalQuantity: 3,
        totalAmount: 99.97,
        isOpen: true,
      },
    };

    renderWithRedux(<Cart />, initialState);

    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("$39.99")).toBeInTheDocument();
    expect(screen.getByText("Total: $99.97")).toBeInTheDocument();
  });

  test("increases item quantity when + button is clicked", () => {
    const initialState = {
      cart: {
        items: [
          {
            id: 1,
            title: "Test Product",
            price: 29.99,
            image: "test.jpg",
            quantity: 1,
          },
        ],
        totalQuantity: 1,
        totalAmount: 29.99,
        isOpen: true,
      },
    };

    const { store } = renderWithRedux(<Cart />, initialState);

    const increaseButton = screen.getByText("+");
    fireEvent.click(increaseButton);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(2);
  });

  test("decreases item quantity when - button is clicked", () => {
    const initialState = {
      cart: {
        items: [
          {
            id: 1,
            title: "Test Product",
            price: 29.99,
            image: "test.jpg",
            quantity: 2,
          },
        ],
        totalQuantity: 2,
        totalAmount: 59.98,
        isOpen: true,
      },
    };

    const { store } = renderWithRedux(<Cart />, initialState);

    const decreaseButton = screen.getByText("-");
    fireEvent.click(decreaseButton);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(1);
  });

  test("removes item when remove button is clicked", () => {
    const initialState = {
      cart: {
        items: [
          {
            id: 1,
            title: "Test Product",
            price: 29.99,
            image: "test.jpg",
            quantity: 1,
          },
        ],
        totalQuantity: 1,
        totalAmount: 29.99,
        isOpen: true,
      },
    };

    const { store } = renderWithRedux(<Cart />, initialState);

    const removeButton = screen.getByText("🗑");
    fireEvent.click(removeButton);

    const state = store.getState();
    expect(state.cart.items).toHaveLength(0);
  });

  test("handles checkout correctly", () => {
    const initialState = {
      cart: {
        items: [
          {
            id: 1,
            title: "Test Product",
            price: 29.99,
            image: "test.jpg",
            quantity: 1,
          },
        ],
        totalQuantity: 1,
        totalAmount: 29.99,
        isOpen: true,
      },
    };

    const { store } = renderWithRedux(<Cart />, initialState);

    const checkoutButton = screen.getByText("Checkout");
    fireEvent.click(checkoutButton);

    expect(global.alert).toHaveBeenCalledWith(
      "Thank you for your purchase! Total: $29.99"
    );

    const state = store.getState();
    expect(state.cart.items).toHaveLength(0);
    expect(state.cart.isOpen).toBe(false);
  });

  test("closes cart when close button is clicked", () => {
    const initialState = {
      cart: {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        isOpen: true,
      },
    };

    const { store } = renderWithRedux(<Cart />, initialState);

    const closeButton = screen.getByText("✕");
    fireEvent.click(closeButton);

    const state = store.getState();
    expect(state.cart.isOpen).toBe(false);
  });

  test("matches snapshot when cart is closed", () => {
    const initialState = {
      cart: {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        isOpen: false,
      },
    };

    const { container } = renderWithRedux(<Cart />, initialState);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("matches snapshot when cart is open with items", () => {
    const initialState = {
      cart: {
        items: [
          {
            id: 1,
            title: "Test Product",
            price: 29.99,
            image: "test.jpg",
            quantity: 2,
          },
        ],
        totalQuantity: 2,
        totalAmount: 59.98,
        isOpen: true,
      },
    };

    const { container } = renderWithRedux(<Cart />, initialState);
    expect(container.firstChild).toMatchSnapshot();
  });
});
