import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
  
  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 0.5rem;
  
  &.add {
    background: #28a745;
    color: white;
    margin-bottom: 1rem;
    &:hover {
      background: #218838;
    }
  }
  
  &.edit {
    background: #007bff;
    color: white;
    &:hover {
      background: #0056b3;
    }
  }
  
  &.delete {
    background: #dc3545;
    color: white;
    &:hover {
      background: #c82333;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  margin-top: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setImagePreview(product.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', e.target.name.value);
      formData.append('description', e.target.description.value);
      formData.append('price', e.target.price.value);
      if (e.target.image.files[0]) {
        formData.append('image', e.target.image.files[0]);
      }

      if (selectedProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${selectedProduct._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        await axios.post('http://localhost:5000/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Container>
        <LoadingSpinner>Loading products...</LoadingSpinner>
      </Container>
    );
  }
  return (
    <Container>
      <Title>Product Management</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button className="add" onClick={handleAdd}>
        Add New Product
      </Button>
      <Table>
        <thead>
          <tr>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <Td>
                <img src={`http://localhost:5000${product.image}`} alt={product.name} />
              </Td>
              <Td>{product.name}</Td>
              <Td>${Number(product.price).toFixed(2)}</Td>
              <Td>
                <Button className="edit" onClick={() => handleEdit(product)}>
                  Edit
                </Button>
                <Button className="delete" onClick={() => handleDelete(product._id)}>
                  Delete
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isModalOpen && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                defaultValue={selectedProduct?.name}
                placeholder="Product Name"
                required
              />
              <TextArea
                name="description"
                defaultValue={selectedProduct?.description}
                placeholder="Product Description"
                required
              />
              <Input
                type="number"
                name="price"
                defaultValue={selectedProduct?.price}
                placeholder="Price"
                step="0.01"
                min="0"
                required
              />
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required={!selectedProduct}
              />
              {imagePreview && (
                <ImagePreview src={`http://localhost:5000${imagePreview}`} alt="Preview" />
              )}
              <Button type="submit" className="edit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Product'}
              </Button>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ProductManagement; 