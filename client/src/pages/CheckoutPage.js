// src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { clearCart } from '../redux/cartSlice';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const OrderSummary = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #dee2e6;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ItemName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
`;

const ItemQuantity = styled.p`
  margin: 0.25rem 0 0;
  color: #666;
`;

const ItemPrice = styled.p`
  margin: 0;
  color: #007bff;
  font-weight: 600;
  font-size: 1.1rem;
`;

const TotalAmount = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #dee2e6;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  text-align: right;
`;

const PaymentButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #218838;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  background: #d4edda;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const CheckoutPage = () => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [user, cart.items, navigate]);

  if (!user || !cart.items || cart.items.length === 0) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const orderData = {
        items: cart.items.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress,
        totalAmount: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      };

      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSuccess(true);
      dispatch(clearCart());
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Container>
      <Title>Checkout</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>Order placed successfully! Redirecting to your orders...</SuccessMessage>}
      <CheckoutContainer>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Shipping Address</Label>
            <Input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your shipping address"
              required
            />
          </FormGroup>
          <PaymentButton type="submit" disabled={loading || success}>
            {loading ? 'Processing...' : 'Place Order'}
          </PaymentButton>
        </Form>
        <OrderSummary>
          <h2>Order Summary</h2>
          {cart.items.map((item) => (
            <OrderItem key={item._id}>
              <ItemImage src={`http://localhost:5000${item.image}`} alt={item.name} />
              <ItemDetails>
                <ItemName>{item.name}</ItemName>
                <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
              </ItemDetails>
              <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
            </OrderItem>
          ))}
          <TotalAmount>
            Total: ${total.toFixed(2)}
          </TotalAmount>
        </OrderSummary>
      </CheckoutContainer>
    </Container>
  );
};

export default CheckoutPage;