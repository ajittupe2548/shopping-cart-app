import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "../components/App";
import productsReducer from "../store/productsSlice";
import cartReducer from "../store/cartSlice";

// Mock child components to isolate App component testing
jest.mock("../components/Header", () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock("../components/ProductList", () => {
  return function MockProductList() {
    return <div data-testid="product-list">ProductList</div>;
  };
});

jest.mock("../components/Cart", () => {
  return function MockCart() {
    return <div data-testid="cart">Cart</div>;
  };
});

const createTestStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
      cart: cartReducer,
    },
  });
};

describe("App Component", () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
  });

  test("renders without crashing", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  test("renders all main components", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(getByTestId("header")).toBeInTheDocument();
    expect(getByTestId("product-list")).toBeInTheDocument();
    expect(getByTestId("cart")).toBeInTheDocument();
  });

  test("matches snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
