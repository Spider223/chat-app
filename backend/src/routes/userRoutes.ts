import {Router, Request, Response} from 'express';
import {protect} from '../middleware/authMiddleware';
import User from '../models/User';

const router = Router();

router.get('/me', protect, async(req: Request, res:Response) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

      try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
})

export default router;