
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const fileUpload = require('express-fileupload');
const path = require('path');

const cors = require('cors');
require('dotenv').config();

const app = express();
// Middleware
app.use(cors()); 
app.use(express.json());
app.use(fileUpload());


// Static files
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

