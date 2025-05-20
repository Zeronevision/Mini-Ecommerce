import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  margin-top: auto;
  width: 100%;
`;

const FooterText = styled.p`
  text-align: center;
  color: #666;
  margin: 0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>&copy; 2025 Zerone Vision. All rights reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;