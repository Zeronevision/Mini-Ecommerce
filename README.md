# Mini E-Commerce Platform

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Protected routes
  - Admin and regular user roles

- **Product Management**
  - Browse products
  - Product details view
  - Admin-only product management (CRUD operations)
  - Image upload functionality

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Persistent cart data
  - Cart synchronization between devices

- **Order Management**
  - Place orders
  - Order history
  - Order status tracking
  - Admin order management

- **Admin Dashboard**
  - Product management
  - Order management
  - User management
  - Admin-only access control

## 🛠️ Technologies Used

### Frontend
- React.js
- Redux Toolkit (State Management)
- React Router (Routing)
- Styled Components (Styling)
- Axios (HTTP Client)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- Multer (File Upload)
- bcryptjs (Password Hashing)

### Development Tools
- Git (Version Control)
- npm (Package Manager)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/Zeronevision/Mini-Ecommerce.git
cd mini-ecommerce
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 🚀 Running the Application

1. Start the server
```bash
cd server
npm start
```

2. Start the client
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
mini-ecommerce/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── redux/         # Redux store and slices
│       └── App.js         # Main application component
│
└── server/                # Backend Node.js application
    ├── config/           # Configuration files
    ├── middleware/       # Custom middleware
    ├── models/          # Mongoose models
    ├── routes/          # API routes
    └── uploads/         # Uploaded files
```

## 🔐 API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - User login
- POST `/api/users/create-admin` - Create admin user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin only)
- PUT `/api/products/:id` - Update product (Admin only)
- DELETE `/api/products/:id` - Delete product (Admin only)

### Orders
- POST `/api/orders` - Create new order
- GET `/api/orders/my-orders` - Get user's orders
- GET `/api/orders` - Get all orders (Admin only)
- PUT `/api/orders/:id/status` - Update order status (Admin only)

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

Amirparsa
- GitHub: [@Zeronevision](https://github.com/Zeronevision)

## 🙏 Acknowledgments

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/) 
