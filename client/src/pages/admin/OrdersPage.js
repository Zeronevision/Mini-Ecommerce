import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OrderDate = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const CustomerInfo = styled.div`
  color: #333;
  font-weight: 500;
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
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
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

const StatusSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
`;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.user.isAdmin) {
      navigate('/login', { state: { from: '/admin/orders' } });
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log('Fetching orders...');
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Orders response:', response.data);
        
        if (Array.isArray(response.data)) {
          setOrders(response.data);
          console.log('Orders state updated:', response.data);
        } else {
          console.error('Response data is not an array:', response.data);
          setError('Invalid response format from server');
        }
      } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { 
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? response.data : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error.message);
      setError('Failed to update order status. Please try again.');
    }
  };

  if (!user || !user.user.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading orders...</LoadingMessage>
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

  console.log('Current orders state:', orders);

  return (
    <Container>
      <Title>All Orders</Title>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <OrderInfo>
                <OrderDate>
                  {new Date(order.createdAt).toLocaleDateString()}
                </OrderDate>
                <CustomerInfo>
                  Customer: {order.user?.name || 'Unknown'} ({order.user?.email || 'Unknown'})
                </CustomerInfo>
              </OrderInfo>
              <StatusSelect
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </StatusSelect>
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

export default OrdersPage; 