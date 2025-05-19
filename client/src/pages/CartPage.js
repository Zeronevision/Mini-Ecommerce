// src/pages/CartPage.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/cartSlice';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart({ id }));
  };

  return (
    <div>
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;