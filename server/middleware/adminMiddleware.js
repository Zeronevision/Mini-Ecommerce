const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status' });
  }
};

module.exports = { admin }; 