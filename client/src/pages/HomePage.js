// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;
const Heading = styled.h2`
  font-size: 2rem; 
  color: #333; 
  text-align: center; 
  margin-bottom: 1rem; 
`;

const Description = styled.p`
  font-size: 1rem; 
  color: #666; 
  line-height: 1.6; 
  text-align: center; 
`;
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner>Loading products...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Welcome to Mini E-commerce</Title>
      <Heading>Our Foods</Heading>
      <Description>
      your one-stop destination for all your vision needs.
        We offer a wide range of high-quality products to enhance your vision and overall eye health.
      </Description>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ProductGrid>
    </Container>
  );
};

export default HomePage;