import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
const ProductDetailsPage = () => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };
  const { id } = useParams();
  //fake data
  const product = {
    id: id,
    name: `Product ${id}`,
    price: (id * 10).toFixed(2),
    image: 'https://via.placeholder.com/300',
    description: 'This is a great product.',
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductDetailsPage;