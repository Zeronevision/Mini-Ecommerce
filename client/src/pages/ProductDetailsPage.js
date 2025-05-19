import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
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
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductDetailsPage;