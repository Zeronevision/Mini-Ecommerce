// src/pages/CartPage.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart, addToCart } from '../redux/cartSlice';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const EmptyCartMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      "image name"
      "image price"
      "image quantity"
      "image remove";
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    grid-area: image;
  }
`;

const ItemName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    grid-area: name;
  }
`;

const ItemPrice = styled.p`
  margin: 0;
  color: #007bff;
  font-weight: 600;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    grid-area: price;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-area: quantity;
  }
`;

const QuantityButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #e9ecef;
  }
`;

const Quantity = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  padding: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #c82333;
  }

  @media (max-width: 768px) {
    grid-area: remove;
  }
`;

const CartSummary = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.1rem;

  &:last-child {
    margin-bottom: 0;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
    font-weight: 600;
    font-size: 1.2rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const CheckoutButton = styled(Button)`
  background: #28a745;
  color: white;

  &:hover {
    background: #218838;
  }
`;

const ClearCartButton = styled(Button)`
  background: #dc3545;
  color: white;

  &:hover {
    background: #c82333;
  }
`;

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      dispatch(removeFromCart(item));
      dispatch(addToCart({ ...item, quantity: newQuantity }));
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0; // Example shipping cost
  const total = subtotal + shipping;

  return (
    <Container>
      <Title>Your Shopping Cart</Title>
      {cartItems.length === 0 ? (
        <EmptyCartMessage>Your cart is empty.</EmptyCartMessage>
      ) : (
        <>
          <CartItems>
            {cartItems.map((item) => (
              <CartItem key={item._id}>
                <ItemImage src={`http://localhost:5000${item.image}`} alt={item.name} />
                <ItemName>{item.name}</ItemName>
                <ItemPrice>${Number(item.price).toFixed(2)}</ItemPrice>
                <QuantityControl>
                  <QuantityButton onClick={() => handleQuantityChange(item, -1)}>-</QuantityButton>
                  <Quantity>{item.quantity}</Quantity>
                  <QuantityButton onClick={() => handleQuantityChange(item, 1)}>+</QuantityButton>
                </QuantityControl>
                <RemoveButton onClick={() => handleRemoveFromCart(item)}>Remove</RemoveButton>
              </CartItem>
            ))}
          </CartItems>

          <CartSummary>
            <SummaryRow>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </SummaryRow>
          </CartSummary>

          <ActionButtons>
            <ClearCartButton onClick={handleClearCart}>Clear Cart</ClearCartButton>
            <CheckoutButton onClick={() => navigate('/checkout')}>Proceed to Checkout</CheckoutButton>
          </ActionButtons>
        </>
      )}
    </Container>
  );
};

export default CartPage;