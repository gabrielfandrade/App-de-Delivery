require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');

const secret = fs.readFileSync('./jwt.evaluation.key', { encoding: 'utf-8' });

const jwtConfig = { algorithm: 'HS256', noTimestamp: true };

const generateJWT = (values) => {
  const payload = {
    name: values.name,
    email: values.email,
    role: values.role,
  };

  return jwt.sign(payload, secret, jwtConfig);
};

const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  } 

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};

module.exports = { generateJWT, validateToken };