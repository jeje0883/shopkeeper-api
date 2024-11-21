import User from '../models/user';
import bcrypt from 'bcrypt';

function register() {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName ||!lastName ||!email ||!password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
    }
     
    
};