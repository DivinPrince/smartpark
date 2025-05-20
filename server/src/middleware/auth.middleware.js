import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user to verify they exist and are an admin
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id)
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }
    
    // Check if the user is an admin
    if (user.email !== 'admin@gmail.com') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (error) {
    console.error('JWT Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};