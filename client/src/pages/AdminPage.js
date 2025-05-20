import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import ProductManagement from '../components/ProductManagement';
import { Link } from 'react-router-dom';

const Container = styled.div`
    max-width: 1200px;
  padding: 2rem;
  width: 100%;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #333;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  background: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#495057'};
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
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
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 0.5rem;
  
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

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdminGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const AdminCard = styled(Link)`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: #666;
  margin: 0;
`;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        {
          name: e.target.name.value,
          email: e.target.email.value,
          isAdmin: e.target.isAdmin.checked,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Container>
      <Title>Admin Dashboard</Title>
      <Tabs>
        <Tab 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          User Management
        </Tab>
        <Tab 
          active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
        >
          Product Management
        </Tab>
      </Tabs>

      {activeTab === 'users' ? (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Admin</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.isAdmin ? 'Yes' : 'No'}</Td>
                  <Td>
                    <Button className="edit" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button className="delete" onClick={() => handleDelete(user._id)}>
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
                <h2>Edit User</h2>
                <Form onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    name="name"
                    defaultValue={selectedUser.name}
                    placeholder="Name"
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    defaultValue={selectedUser.email}
                    placeholder="Email"
                    required
                  />
                  <Label>
                    <Checkbox
                      type="checkbox"
                      name="isAdmin"
                      defaultChecked={selectedUser.isAdmin}
                    />
                    Admin User
                  </Label>
                  <Button type="submit" className="edit">
                    Save Changes
                  </Button>
                </Form>
              </ModalContent>
            </Modal>
          )}
        </>
      ) : (
        <ProductManagement />
      )}

      <AdminGrid>
        <AdminCard to="/admin/orders">
          <CardTitle>Manage Orders</CardTitle>
          <CardDescription>
            View and manage customer orders
          </CardDescription>
        </AdminCard>
      </AdminGrid>
    </Container>
  );
};

export default AdminPage; 