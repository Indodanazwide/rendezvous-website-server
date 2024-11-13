import jwt from 'jsonwebtoken';

// Role-based access control middleware
export const authorize = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Add decoded user info to request object

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next(); // User is authorized, proceed to the route handler
    } catch (err) {
      const message = err.name === 'TokenExpiredError' ? 'Session expired, please log in again' : 'Token is not valid';
      return res.status(401).json({ message });
    }
  };
};