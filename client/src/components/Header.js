import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../redux/authSlice';

const HeaderContainer = styled.header`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  
  &:hover {
    color: #007bff;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #666;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #007bff;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  
  &:hover {
    color: #007bff;
  }
`;

const UserInfo = styled.span`
  color: #666;
  margin-right: 1rem;
`;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">Zerone Vision</Logo>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          {user ? (
            <>
              {user.user.isAdmin && <NavLink to="/admin">Admin</NavLink>}
              <UserInfo>Welcome, {user.user.name}</UserInfo>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;