import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Header from "../components/Header";
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

describe("Header", () => {
  test("renders header with title and cart button", () => {
    renderWithRedux(<Header />);

    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cart/i })).toBeInTheDocument();
  });

  test("does not show cart count when cart is empty", () => {
    renderWithRedux(<Header />);

    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });

  test("shows correct cart count when items are in cart", () => {
    const initialState = {
      cart: {
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
        totalQuantity: 3,
        totalAmount: 59.98,
        isOpen: false,
      },
    };

    renderWithRedux(<Header />, initialState);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("toggles cart when cart button is clicked", () => {
    const { store } = renderWithRedux(<Header />);

    const cartButton = screen.getByRole("button", { name: /cart/i });
    fireEvent.click(cartButton);

    const state = store.getState();
    expect(state.cart.isOpen).toBe(true);
  });

  test("matches snapshot with empty cart", () => {
    const initialState = {
      cart: {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        isOpen: false,
      },
    };

    const { container } = renderWithRedux(<Header />, initialState);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("matches snapshot with items in cart", () => {
    const initialState = {
      cart: {
        items: [{ id: 1, quantity: 3 }],
        totalQuantity: 5,
        totalAmount: 100,
        isOpen: false,
      },
    };

    const { container } = renderWithRedux(<Header />, initialState);
    expect(container.firstChild).toMatchSnapshot();
  });
});
