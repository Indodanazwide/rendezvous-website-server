import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import dotenv from 'dotenv'

dotenv.config()

export const signup = async (req, res) => {
    const { name, surname, username, email, password, role } = req.body

    try {
        const existingUserBtEmail = await User.findOne({ email })

        if (existingUserBtEmail) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        const existingUserByUsername = await User.findOne({ username })

        if (existingUserBtEmail) {
            return res.status(400).json({ message: 'Username already exists' })
        }

        const newUser = new User({
            name,
            surname,
            username,
            email,
            password,
            role
        })

        await newUser.save()

        const userResponse = newUser.toObject()

        delete userResponse.password

        res.status(201).json({
            message: 'User created successfully',
            user: userResponse
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const payload = {
            userId: user._id,
            role: user.role,
            email: user.email
        }
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(200).json({
            message: 'Login successful',
            user: userResponse,
            token: token
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const getUserById = async (req, res) => {
    const userId = req.params.id

    try {
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userResponse = user.toObject()
        delete userResponse.password
        
        res.status(200).json(userResponse)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const updateUserById = async (req, res) => {
    const userId = req.params.id;
    const { name, surname, username, email, password, role, accountStatus } = req.body;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        user.name = name || user.name;
        user.surname = surname || user.surname;
        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;
        user.accountStatus = accountStatus || user.accountStatus;

        if (password) {
            user.password = password;
        }

        await user.save()

        const updatedUser = user.toObject()
        delete updatedUser.password

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteUserById = async (req, res) => {
    const userId = req.params.id

    try {
        const user = await User.findByIdAndDelete(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}