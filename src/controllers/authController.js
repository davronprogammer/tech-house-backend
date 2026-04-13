import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addUser, findUserByEmail, getUsers } from '../data/db.js';
import { JWT_SECRET, TOKEN_EXPIRES_IN } from '../config/auth.js';
import generateId from '../utils/generateid.js';

export async function register(req, res) {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "username, email va password majburiy"
        });
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: "Bu email bilan foydalanuvchi allaqachon mavjud"
            });
        }

        const users = await getUsers();
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = generateId(users);
        const newUser = {
            id: userId,
            username,
            email,
            password: passwordHash
        };

        await addUser(newUser);
        console.log("Ro'yxatdan o'tgan foydalanuvchi:", username, email);

        return res.status(201).json({
            message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
            user: { id: userId, username, email }
        });
    } catch (error) {
        console.error("Register xatosi:", error);
        return res.status(500).json({ message: "Server xatosi" });
    }
}



export async function login(req, res) {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !password) {
        return res.status(400).json({
            message: "Email va password majburiy"
        });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                message: "Email yoki parol noto'g'ri"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Email yoki parol noto'g'ri"
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRES_IN }
        );  

        console.log("Login bo'ldi:", user.username);

        return res.status(200).json({
            message: "Muvaffaqiyatli kirildi",
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error("Login xatosi:", error);
        return res.status(500).json({ message: "Server xatosi" });
    }
}
