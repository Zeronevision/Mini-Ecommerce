import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavContainer = styled.nav`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.2s;

  &:hover {
    color: #007bff;
  }
`;

const AdminLink = styled(NavLink)`
  color: #dc3545;
  font-weight: 500;

  &:hover {
    color: #c82333;
  }
`;

const OrdersLink = styled(NavLink)`
  color: #28a745;
  font-weight: 500;

  &:hover {
    color: #218838;
  }
`;

const Navbar = ({ user }) => {
  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">Mini E-Commerce</Logo>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          {user ? (
            <>
              <OrdersLink to="/my-orders">My Orders</OrdersLink>
              {user.user.isAdmin && (
                <>
                  <AdminLink to="/admin">Admin Dashboard</AdminLink>
                  <AdminLink to="/admin/orders">Manage Orders</AdminLink>
                </>
              )}
              <NavLink to="/profile">{user.user.name}</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar; 