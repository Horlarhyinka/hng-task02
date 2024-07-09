// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db.config';
import { User } from '../models/user';
import { verifyJWT } from '../utils/jwt';

interface ExtReq extends Request{
    user: User
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded: any = await verifyJWT(token)
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { userId: decoded.id} });
        if (!user) throw new Error('User not found');
        (req as ExtReq).user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
