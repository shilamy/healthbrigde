import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../modules/types/type';

const secret: string = process.env.JWT_SECRET || 'secret';

// interface AuthenticatedRequest extends Request {
//     user?: JwtPayload;
// }
const authentication = (req: Request, res: Response, next: NextFunction) => {
    if (!secret) {
        throw new Error('JWT_SECRET must be defined in environment variables');
    }
    const token = req.headers.authorization?.split(' ')[1] as string;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, secret as string) as JwtPayload;
        // return decoded;
        if (!decoded) {
            res.status(401).json({ message: 'Unauthorized' })
            return;
        }

        req.user = decoded //as  { id: string; role: UserRole };
        next();
    
    } catch (error) {
        console.error('AUTHENTICATION ERROR:', error);
        res.status(401).send({ error: 'Please authenticate.' });
    } 
};
