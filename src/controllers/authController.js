import users from '../data/db.js';
import genereateid from '../utils/generateid.js';
import bcrypt from 'bcrypt';

export function register(req, res){
    console.log(`checking request body ${req.body}`);

    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            massage: "username, email and password are required"
    });
    }

    const existingUser = users.find(user => user.email === email);
    if(existingUser){
        return res.status(400).json({
            massage: "user with this email already exists"
        });
    }

    const passwordHash = bcrypt.hash(password, 10);

    const userId = genereateid(users);
    users.push({id: userId, username, email, password});
    const user = {
        id: userId,
        username,
        email,
        password: passwordHash
    }
    console.log(`user info ${username} ${email} ${password}`);
    
}

export function login(){}