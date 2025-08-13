import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentPage: 1,
  itemsPerPage: 4, // default value
  selectedCategory: "all", // new state for category filter
  minPrice: 0,
  maxPrice: 0,
  minRating: 0,
  maxRating: 0,
  selectedMinPrice: 0,
  selectedMaxPrice: 0,
  selectedMinRating: 0,
  selectedMaxRating: 0,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setItemsPerPage(state, action) {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // reset to first page when items per page changes
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // reset to first page when category changes
    },
    setSelectedMinPrice(state, action) {
      state.selectedMinPrice = action.payload;
      state.currentPage = 1;
    },
    setSelectedMaxPrice(state, action) {
      state.selectedMaxPrice = action.payload;
      state.currentPage = 1;
    },
    setSelectedMinRating(state, action) {
      state.selectedMinRating = action.payload;
      state.currentPage = 1;
    },
    setSelectedMaxRating(state, action) {
      state.selectedMaxRating = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        // Set price and rating bounds
        const prices = action.payload.map(p => p.price);
        const ratings = action.payload.map(p => p.rating?.rate || 0);
        state.minPrice = Math.floor(Math.min(...prices));
        state.maxPrice = Math.ceil(Math.max(...prices));
        state.minRating = Math.floor(Math.min(...ratings));
        state.maxRating = Math.ceil(Math.max(...ratings));
        // Set selected to full range by default
        state.selectedMinPrice = state.minPrice;
        state.selectedMaxPrice = state.maxPrice;
        state.selectedMinRating = state.minRating;
        state.selectedMaxRating = state.maxRating;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentPage,
  setItemsPerPage,
  setSelectedCategory,
  setSelectedMinPrice,
  setSelectedMaxPrice,
  setSelectedMinRating,
  setSelectedMaxRating,
} = productsSlice.actions;

export default productsSlice.reducer;
