# Shopping Cart Web Application

A responsive shopping cart web application built with React and Redux Toolkit. This application fetches products from the Fake Store API and allows users to browse products and manage a shopping cart.

## Features

- Product Listing Page: Display products fetched from https://fakestoreapi.com/products
- Add to Cart Functionality: Each product has an 'Add to Cart' button
- Responsive Design: Usable and looks good on different screen sizes
- Functional Unit Test Cases: Comprehensive test coverage

## Framework and Library Versions

### Core Technologies

- React: 18.2.0
- Redux Toolkit: 2.8.2
- React Redux: 9.2.0

### Development Tools

- Webpack: 5.88.2
- Babel: 7.22.20
- Jest: 30.0.5
- Testing Library React: 16.3.0

### Styling

- SCSS Modules: Component-specific styling
- CSS3: Custom responsive styles

## Prerequisites

- Node.js: Version 14.x or higher
- npm: Version 6.x or higher

## Installation and Setup

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd shopping-cart-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm start
   ```

4. Open your browser
   Navigate to: http://localhost:4000

## Available Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Format code
npm run format

# Run linting
npm run lint
```

## Application Structure

```
src/
├── components/
│   ├── App.js                   # Main application component
│   ├── Cart.js                  # Shopping cart sidebar
│   ├── Cart.module.scss         # Cart component styles
│   ├── Header.js                # Header with cart icon and count
│   ├── Header.module.scss       # Header component styles
│   ├── ProductCard.js           # Individual product card component
│   ├── ProductCard.module.scss  # ProductCard component styles
│   ├── ProductList.js           # Product listing container
│   └── ProductList.module.scss  # ProductList component styles
├── store/
│   ├── index.js                 # Redux store configuration
│   ├── productsSlice.js         # Products state management
│   └── cartSlice.js             # Cart state management
├── __tests__/                   # Unit tests
├── index.css                    # Global styles
├── index.js                     # Application entry point
└── setupTests.js                # Test configuration
```

## Live Application

Live URL: [Deployed Application URL Here]
