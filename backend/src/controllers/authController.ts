import {Request, Response} from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id: string, username: string): string => {
    return jwt.sign({id, username}, process.env.JWT_SECRET as string, {
        expiresIn: '1h'
    })
}

export const registerUser = async (req: Request, res: Response) => {
    const {username, password, email} = req.body;

    if(!username || !password || !email){
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ message: 'User with that email already exists' });
        }

        user = await User.findOne({ username }) 
        if (user) {
            return res.status(400).json({ message: 'User with that username already exists' });
        }

        user = new User({
            username, 
            email,
            password
        })

        await user.save();

        const token = generateToken(String(user._id), user.username);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error: any) {
         console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const loginUser = async(req: Request, res: Response) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(String(user._id), user.username);
        
        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error: any) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error' });
    }

}