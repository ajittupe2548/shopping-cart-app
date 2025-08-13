import React from "react";
import Header from "./Header";
import ProductList from "./ProductList";
import Cart from "./Cart";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
      </Routes>
      <Cart />
    </>
  );
}

export default App;
