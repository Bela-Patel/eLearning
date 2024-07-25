const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
    if(req.header('Authorization')==undefined){
        res.status(401).send('Please authenticate');
        return;
    }
    const token = req.header('Authorization');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        process.env.UserID = decoded.id;
        process.env.Role = decoded.role;
        const user = await User.findOne({ _id: decoded.id});
        if (!user) {
          throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
      } catch (err) {
        res.status(401).send({ error: 'Please authenticate' });
      }
}

module.exports = authenticateToken;
