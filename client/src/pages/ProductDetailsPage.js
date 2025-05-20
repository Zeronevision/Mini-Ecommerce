import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import { addToCart } from '../redux/cartSlice';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductName = styled.h1`
  text-align: center;
  margin: 0;
  color: #333;
  font-size: 2rem;
`;

const ProductPrice = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: #007bff;
  margin: 0;
`;

const ProductDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const AddToCartButton = styled.button`
  padding: 1rem 2rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.1rem;
  transition: background-color 0.2s ease;
  margin-top: auto;

  &:hover {
    background: #218838;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
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

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #5a6268;
  }
`;

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner>Loading product details...</LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <ErrorMessage>Product not found</ErrorMessage>
        <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>← Back to Products</BackButton>
      <ProductContainer>
        <ImageContainer>
          <img src={`http://localhost:5000${product.image}`} alt={product.name} />
        </ImageContainer>
        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <ProductPrice>${Number(product.price).toFixed(2)}</ProductPrice>
          <ProductDescription>{product.description}</ProductDescription>
          <AddToCartButton onClick={handleAddToCart}>
            Add to Cart
          </AddToCartButton>
        </ProductInfo>
      </ProductContainer>
    </Container>
  );
};

export default ProductDetailsPage;