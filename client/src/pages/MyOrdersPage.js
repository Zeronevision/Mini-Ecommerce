import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const OrderHeader = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderDate = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const OrderStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const OrderItems = styled.div`
  padding: 1rem;
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

const OrderSummary = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalAmount = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

const ShippingAddress = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-orders' } });
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(response.data);
      } catch (error) {
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading your orders...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>My Orders</Title>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <OrderDate>
                {new Date(order.createdAt).toLocaleDateString()}
              </OrderDate>
              <OrderStatus status={order.status}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </OrderStatus>
            </OrderHeader>
            <OrderItems>
              {order.items.map((item) => (
                <OrderItem key={item._id}>
                  <ItemImage src={`http://localhost:5000${item.image}`} alt={item.name} />
                  <ItemDetails>
                    <ItemName>{item.name}</ItemName>
                    <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
                  </ItemDetails>
                  <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
                </OrderItem>
              ))}
            </OrderItems>
            <OrderSummary>
              <ShippingAddress>
                Shipping Address: {order.shippingAddress}
              </ShippingAddress>
              <TotalAmount>
                Total: ${order.totalAmount.toFixed(2)}
              </TotalAmount>
            </OrderSummary>
          </OrderCard>
        ))
      )}
    </Container>
  );
};

export default MyOrdersPage; 