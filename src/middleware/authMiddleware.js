import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';

export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Token mavjud emas" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token yaroqsiz" });
        }

        req.user = decoded;
        next();
    });
}
