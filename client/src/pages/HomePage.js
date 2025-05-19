// src/pages/HomePage.js
import React from 'react';
import ProductCard from '../components/ProductCard';

const products = [
  {
    id: 1,
    name: 'Product 1',
    price: 29.99,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Product 2',
    price: 39.99,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Product 3',
    price: 49.99,
    image: 'https://via.placeholder.com/150',
  },
];

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Mini E-commerce</h1>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;