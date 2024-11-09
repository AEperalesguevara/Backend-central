import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        return;
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT secret is not defined in environment variables.");
        res.status(500).json({ success: false, message: 'Server configuration error.' });
        return;
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        const errorMessage = error instanceof jwt.JsonWebTokenError
            ? 'Invalid token. Please login again.'
            : 'Token verification failed. Please try again.';
        res.status(401).json({ success: false, message: errorMessage });
    }
};

export default authMiddleware;
