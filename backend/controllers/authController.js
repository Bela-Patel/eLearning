const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
    const { name, password, email, role } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userExist = await User.findOne({ email });

        if (userExist) return res.status(400).send('User is already exist.');

        if (role && !['student', 'instructor', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role specified' });
        }
        const user = new User({ name, password: hashedPassword, email, role });
        await user.save();
        res.status(201).send({message: 'User registered'});
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getUserAccessLevel = (req, res) => {
    const { role } = req.user;

    const accessLevels = {
        student: 'read',
        instructor: 'write',
        admin: 'all'
    };

    const accessLevel = accessLevels[role] || 'none';
    res.status(200).json({ role, accessLevel });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid credentials');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');
       
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.json({ user, token });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
