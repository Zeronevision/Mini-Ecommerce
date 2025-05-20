import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addToCart } from '../redux/cartSlice';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
`;

const ProductPrice = styled.p`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #007bff;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background: #218838;
  }
`;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    dispatch(addToCart(product));
  };
 
  return (
    <Card>
      <ProductLink to={`/product/${product._id}`}>
        <ImageContainer>
          <img src={`http://localhost:5000${product.image}`} alt={product.name} />
        </ImageContainer>
        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <ProductPrice>${Number(product.price).toFixed(2)}</ProductPrice>
        </ProductInfo>
      </ProductLink>
      <AddToCartButton onClick={handleAddToCart}>
        Add to Cart
      </AddToCartButton>
    </Card>
  );
};

export default ProductCard;